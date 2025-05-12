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
  console.log('Initializing Google Sheets with credentials...');
  console.log('Client Email:', process.env.GOOGLE_CLIENT_EMAIL);
  console.log('Spreadsheet ID:', SPREADSHEET_ID);
  console.log('Private Key Length:', process.env.GOOGLE_PRIVATE_KEY?.length || 0);

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
  console.log('Contact form handler called with method:', req.method);
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Parsing request body...');
    const data = contactFormSchema.parse(req.body || (typeof req.body === 'string' ? JSON.parse(req.body) : {}));
    console.log('Parsed data:', data);

    console.log('Getting Google Sheets instance...');
    const sheets = getSheets();

    console.log('Attempting to append to Google Sheets:', {
      spreadsheetId: SPREADSHEET_ID,
      range: 'Contact Form!A:C',
      values: [data.name, data.email, data.message || ''],
    });

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

    console.log('Successfully appended to Google Sheets');
    return res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error: any) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    if (error instanceof z.ZodError) {
      console.log('Validation error:', error.errors);
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 