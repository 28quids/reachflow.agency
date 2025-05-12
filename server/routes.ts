import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertAuditRequestSchema } from "../shared/schema.js";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { google } from 'googleapis';

// Initialize Google Sheets API
let sheets: any;
let SPREADSHEET_ID: string;

try {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheets = google.sheets({ version: 'v4', auth });
  SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '';

  // Log environment variables (without sensitive data)
  console.log('Google Sheets Configuration:');
  console.log('Client Email:', process.env.GOOGLE_CLIENT_EMAIL);
  console.log('Spreadsheet ID:', SPREADSHEET_ID);
  console.log('Private Key Length:', process.env.GOOGLE_PRIVATE_KEY?.length || 0);
} catch (error) {
  console.error('Error initializing Google Sheets:', error);
  sheets = null;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Note: API routes have been moved to Vercel serverless functions
  // - /api/audit-requests -> api/audit-requests.ts
  // - /api/contact -> api/contact.ts

  const httpServer = createServer(app);
  return httpServer;
}
