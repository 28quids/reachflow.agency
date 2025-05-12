import { z } from 'zod';
import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const auditFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().min(1),
  business: z.string().optional(),
  goals: z.array(z.string()).optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('[API HIT] /api/audit-requests', req.method, req.body);

  try {
    // Validate request body
    const validatedData = auditFormSchema.parse(req.body);

    // Initialize Google Sheets client
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare row data
    const rowData = [
      validatedData.name,
      validatedData.email,
      validatedData.phone || '',
      validatedData.website,
      validatedData.business || '',
      validatedData.goals?.join(', ') || ''
    ];

    // Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Audit Requests!A:F',
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData],
      },
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error processing audit request:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
} 