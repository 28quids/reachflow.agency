import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { z } from 'zod';

const auditFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().min(1),
  business: z.string().optional(),
  goals: z.array(z.string()).optional(),
});

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[API HIT] /api/audit-requests received', req.method, req.url);
  console.log('[API HIT] Headers:', req.headers);
  console.log('[API HIT] Body:', req.body);

  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log request details
    const requestLog = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString()
    };
    console.log('[Audit Request] Received:', JSON.stringify(requestLog, null, 2));

    const data = auditFormSchema.parse(req.body || (typeof req.body === 'string' ? JSON.parse(req.body) : {}));
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
    // Log error details
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
} 