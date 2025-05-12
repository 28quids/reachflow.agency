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
  // API routes for audit requests
  app.post("/api/audit-requests", async (req, res) => {
    try {
      // Validate the request body
      const auditRequestData = insertAuditRequestSchema.parse(req.body);
      
      // Store the audit request in the database
      const auditRequest = await storage.createAuditRequest(auditRequestData);
      
      // Add to Google Sheets
      try {
        console.log('Attempting to append to Google Sheets (Audit):', {
          spreadsheetId: SPREADSHEET_ID,
          range: 'Audit Requests!A:F',
          values: [
            auditRequestData.name,
            auditRequestData.email,
            auditRequestData.phone || '',
            auditRequestData.website,
            auditRequestData.business || '',
            auditRequestData.goals?.join(', ') || '',
          ],
        });

        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: 'Audit Requests!A:F', // Name, Email, Phone, Website, Business, Goals
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              auditRequestData.name,
              auditRequestData.email,
              auditRequestData.phone || '',
              auditRequestData.website,
              auditRequestData.business || '',
              auditRequestData.goals?.join(', ') || '',
            ]],
          },
        });
        console.log('Successfully appended to Google Sheets (Audit)');
      } catch (sheetsError) {
        console.error('Google Sheets Error (Audit):', sheetsError);
        // Continue with the response even if Sheets fails
      }
      
      // Return the created audit request
      res.status(201).json({ 
        message: "Audit request received successfully", 
        auditRequest 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.message 
        });
      } else {
        console.error("Error creating audit request:", error);
        res.status(500).json({ 
          message: "Failed to create audit request" 
        });
      }
    }
  });

  // Note: Contact form endpoint has been moved to Vercel serverless function at /api/contact

  // Get all audit requests (for admin purposes in a real app)
  app.get("/api/audit-requests", async (req, res) => {
    try {
      const auditRequests = await storage.getAllAuditRequests();
      res.json(auditRequests);
    } catch (error) {
      console.error("Error fetching audit requests:", error);
      res.status(500).json({ 
        message: "Failed to fetch audit requests" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
