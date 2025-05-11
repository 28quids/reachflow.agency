import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAuditRequestSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for audit requests
  app.post("/api/audit-requests", async (req, res) => {
    try {
      // Validate the request body
      const auditRequestData = insertAuditRequestSchema.parse(req.body);
      
      // Store the audit request
      const auditRequest = await storage.createAuditRequest(auditRequestData);
      
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
