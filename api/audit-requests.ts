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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = auditFormSchema.parse(req.body || (typeof req.body === 'string' ? JSON.parse(req.body) : {}));
    const sheets = getSheets();

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

    return res.status(201).json({ message: 'Audit request received successfully' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 