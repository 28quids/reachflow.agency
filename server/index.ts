import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { google } from 'googleapis';
import { z } from 'zod';

// Initialize the Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
  console.error(err);
});

// Google Sheets setup
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '';

function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

// Form schemas
const auditFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().min(1),
  business: z.string().optional(),
  goals: z.array(z.string()).optional(),
});

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  message: z.string().optional(),
});

// API Routes
app.post('/api/audit-requests', async (req, res) => {
  console.log('[API HIT] /api/audit-requests received', req.method, req.url);
  console.log('[API HIT] Headers:', req.headers);
  console.log('[API HIT] Body:', req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const requestLog = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString()
    };
    console.log('[Audit Request] Received:', JSON.stringify(requestLog, null, 2));

    const data = auditFormSchema.parse(req.body);
    console.log('[Audit Request] Parsed data:', JSON.stringify(data, null, 2));
    
    const sheets = getSheets();
    console.log('[Audit Request] Got sheets instance');

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Audit Requests!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          data.name,
          data.email,
          data.phone || '',
          data.website,
          data.business || '',
          data.goals?.join(', ') || '',
        ]],
      },
    });

    console.log('[Audit Request] Successfully appended to Google Sheets');
    return res.status(201).json({ message: 'Audit request received successfully' });
  } catch (error: any) {
    const errorLog = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    console.error('[Audit Request] Error:', JSON.stringify(errorLog, null, 2));

    if (error instanceof z.ZodError) {
      console.log('[Audit Request] Validation error:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/contact', async (req, res) => {
  console.log('[API HIT] /api/contact received', req.method, req.url);
  console.log('[API HIT] Headers:', req.headers);
  console.log('[API HIT] Body:', req.body);

  if (req.method !== 'POST') {
    console.log('[Contact Form] Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const requestLog = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString()
    };
    console.log('[Contact Form] Received:', JSON.stringify(requestLog, null, 2));

    const data = contactFormSchema.parse(req.body);
    console.log('[Contact Form] Parsed data:', JSON.stringify(data, null, 2));

    console.log('[Contact Form] Getting Google Sheets instance...');
    const sheets = getSheets();

    console.log('[Contact Form] Attempting to append to Google Sheets:', JSON.stringify({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Contact Form!A:C',
      values: [data.name, data.email, data.message || ''],
    }, null, 2));

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Contact Form!A:C',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          data.name,
          data.email,
          data.message || '',
        ]],
      },
    });

    console.log('[Contact Form] Successfully appended to Google Sheets');
    return res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error: any) {
    const errorLog = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    console.error('[Contact Form] Error:', JSON.stringify(errorLog, null, 2));

    if (error instanceof z.ZodError) {
      console.log('[Contact Form] Validation error:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

async function initializeApp() {
  // Initialize routes
  const server = await registerRoutes(app);

  // Setup static file serving
  if (process.env.NODE_ENV === 'development') {
    // In development, use Vite
    const { setupVite } = await import('./vite.js');
    await setupVite(app, server);
  } else {
    // In production, serve static files
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    app.use(express.static(path.resolve(__dirname, '../dist')));
    
    // Serve index.html for all routes (SPA support)
    app.get('*', (_, res) => {
      res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    });
  }

  // Start server if not in Vercel environment
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const port = process.env.PORT || 5001;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}

// Initialize the app
initializeApp().catch(console.error);

export default app;
