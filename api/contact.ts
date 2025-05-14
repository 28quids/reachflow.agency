import { z } from 'zod';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { appendToSheet } from './utils/googleSheets';

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== Contact API Hit ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Validating request body...');
    const data = contactFormSchema.parse(req.body);
    console.log('Validated data:', data);
    
    console.log('Attempting to append to sheet...');
    // Append to Google Sheet
    await appendToSheet('Contact Form', [
      data.name,
      data.email,
      data.message || '',
      new Date().toISOString() // Adding timestamp
    ]);
    console.log('Successfully appended to sheet');

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in contact API:', error);
    
    if (error instanceof z.ZodError) {
      console.log('Validation error:', error.errors);
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    
    return res.status(500).json({ error: 'Failed to save data', details: error instanceof Error ? error.message : 'Unknown error' });
  }
} 