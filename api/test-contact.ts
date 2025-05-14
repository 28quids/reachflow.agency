import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Initialize Google Sheets client
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Log the attempt
    console.log('Attempting to append to sheet:', {
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      sheetName: 'Contact Form',
      data: [name, email, message || '', new Date().toISOString()]
    });

    // Append to Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Contact Form!A:D',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[name, email, message || '', new Date().toISOString()]],
      },
    });

    console.log('Append response:', response.data);

    return res.status(200).json({ 
      success: true,
      message: 'Data saved successfully',
      response: response.data
    });
  } catch (error) {
    console.error('Error saving data:', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined,
    });
  }
} 