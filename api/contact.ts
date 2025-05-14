import { z } from 'zod';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { appendToSheet } from './utils/googleSheets';

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = contactFormSchema.parse(req.body);
    
    // Append to Google Sheet
    await appendToSheet('Contact Form', [
      data.name,
      data.email,
      data.message || '',
      new Date().toISOString() // Adding timestamp
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    
    return res.status(500).json({ error: 'Failed to save data' });
  }
} 