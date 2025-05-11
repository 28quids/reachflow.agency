import { users, type User, type InsertUser, type AuditRequest, type InsertAuditRequest } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Audit requests methods
  createAuditRequest(auditRequest: InsertAuditRequest): Promise<AuditRequest>;
  getAuditRequest(id: number): Promise<AuditRequest | undefined>;
  getAllAuditRequests(): Promise<AuditRequest[]>;
  updateAuditRequestContactStatus(id: number, isContacted: boolean): Promise<AuditRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private auditRequests: Map<number, AuditRequest>;
  private currentUserId: number;
  private currentAuditRequestId: number;

  constructor() {
    this.users = new Map();
    this.auditRequests = new Map();
    this.currentUserId = 1;
    this.currentAuditRequestId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createAuditRequest(insertAuditRequest: InsertAuditRequest): Promise<AuditRequest> {
    const id = this.currentAuditRequestId++;
    const auditRequest: AuditRequest = { 
      ...insertAuditRequest, 
      id, 
      createdAt: new Date(), 
      isContacted: false 
    };
    this.auditRequests.set(id, auditRequest);
    return auditRequest;
  }

  async getAuditRequest(id: number): Promise<AuditRequest | undefined> {
    return this.auditRequests.get(id);
  }

  async getAllAuditRequests(): Promise<AuditRequest[]> {
    return Array.from(this.auditRequests.values());
  }

  async updateAuditRequestContactStatus(id: number, isContacted: boolean): Promise<AuditRequest | undefined> {
    const auditRequest = this.auditRequests.get(id);
    if (!auditRequest) return undefined;

    const updatedRequest = { ...auditRequest, isContacted };
    this.auditRequests.set(id, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();
