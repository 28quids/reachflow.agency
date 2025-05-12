import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  message: z.string().optional(),
});

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '';

function getSheets() {
  console.log('[Contact Form] Initializing Google Sheets with credentials...');
  console.log('[Contact Form] Client Email:', process.env.GOOGLE_CLIENT_EMAIL);
  console.log('[Contact Form] Spreadsheet ID:', SPREADSHEET_ID);
  console.log('[Contact Form] Private Key Length:', process.env.GOOGLE_PRIVATE_KEY?.length || 0);

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
  console.log('[API HIT] /api/contact received', req.method, req.url);
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
    console.log('[Contact Form] Method not allowed:', req.method);
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
    console.log('[Contact Form] Received:', JSON.stringify(requestLog, null, 2));

    const data = contactFormSchema.parse(req.body || (typeof req.body === 'string' ? JSON.parse(req.body) : {}));
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
    // Log error details
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
} 