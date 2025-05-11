import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Audit requests schema
export const auditRequests = pgTable("audit_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  website: text("website").notNull(),
  business: text("business"),
  goals: text("goals").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isContacted: boolean("is_contacted").default(false).notNull(),
});

export const insertAuditRequestSchema = createInsertSchema(auditRequests).omit({
  id: true,
  createdAt: true,
  isContacted: true,
});

export type InsertAuditRequest = z.infer<typeof insertAuditRequestSchema>;
export type AuditRequest = typeof auditRequests.$inferSelect;
