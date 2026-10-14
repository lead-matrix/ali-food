// Repository interface and factory for M/S Ali Food data layer
import { 
  Client, 
  BillingProduct, 
  Delivery, 
  Invoice, 
  Payment, 
  Complaint, 
  ComplaintMessage, 
  AppSettings, 
  ActivityLog, 
  FullBackupPayload 
} from './types';
import { isSupabaseConfigured, supabase } from '../supabase';
import { localAdapter } from './localAdapter';
import { supabaseAdapter } from './supabaseAdapter';

export interface IRepository {
  mode: 'local' | 'cloud';

  // Clients
  getClients(includeDeleted?: boolean): Promise<Client[]>;
  getClientById(id: string): Promise<Client | null>;
  saveClient(client: Partial<Client>): Promise<Client>;
  deleteClient(id: string, soft?: boolean): Promise<void>;
  restoreClient(id: string): Promise<void>;

  // Products
  getProducts(): Promise<BillingProduct[]>;
  saveProduct(product: Partial<BillingProduct>): Promise<BillingProduct>;

  // Deliveries
  getDeliveries(clientId?: string, includeDeleted?: boolean): Promise<Delivery[]>;
  getDeliveryById(id: string): Promise<Delivery | null>;
  saveDelivery(delivery: Partial<Delivery>): Promise<Delivery>;
  deleteDelivery(id: string, soft?: boolean): Promise<void>;
  restoreDelivery(id: string): Promise<void>;

  // Invoices
  getInvoices(clientId?: string, includeDeleted?: boolean): Promise<Invoice[]>;
  getInvoiceById(id: string): Promise<Invoice | null>;
  saveInvoice(invoice: Partial<Invoice>): Promise<Invoice>;
  voidInvoice(id: string, reason: string): Promise<Invoice>;
  deleteInvoice(id: string, soft?: boolean): Promise<void>;
  restoreInvoice(id: string): Promise<void>;
  convertDeliveriesToInvoice(clientId: string, deliveryIds: string[], dueDate?: string, notes?: string): Promise<Invoice>;
  generateMonthlyInvoices(periodFrom: string, periodTo: string): Promise<{ created: Invoice[]; errors: string[] }>;

  // Payments
  getPayments(clientId?: string, includeDeleted?: boolean): Promise<Payment[]>;
  getPaymentById(id: string): Promise<Payment | null>;
  recordPayment(payment: Partial<Payment>): Promise<Payment>;
  deletePayment(id: string, soft?: boolean): Promise<void>;
  restorePayment(id: string): Promise<void>;

  // Complaints
  getComplaints(clientId?: string): Promise<Complaint[]>;
  getComplaintById(id: string): Promise<Complaint | null>;
  saveComplaint(complaint: Partial<Complaint>): Promise<Complaint>;
  addComplaintMessage(complaintId: string, msg: { senderRole: 'admin' | 'client'; senderName: string; message: string; attachmentUrl?: string }): Promise<ComplaintMessage>;
  updateComplaintStatus(id: string, status: Complaint['status'], priority?: Complaint['priority']): Promise<Complaint>;

  // Settings
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: Partial<AppSettings>): Promise<AppSettings>;

  // Activity Log
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
  logActivity(action: string, entity: ActivityLog['entity'], entityId: string, description: string, performedBy?: string): Promise<void>;

  // Ledger & Metrics
  getClientLedger(clientId: string): Promise<{
    client: Client | null;
    deliveries: Delivery[];
    invoices: Invoice[];
    payments: Payment[];
    totalBilled: number;
    totalPaid: number;
    runningBalance: number;
  }>;

  getDashboardMetrics(): Promise<{
    todayDeliveries: Delivery[];
    totalUnpaid: number;
    overdueAmount: number;
    monthBilled: number;
    monthCollected: number;
    openComplaintsCount: number;
    topDebtors: { client: Client; balance: number }[];
  }>;

  // Local backups, CSV, and Cloud Sync
  exportFullBackup(): Promise<FullBackupPayload>;
  importFullBackup(payload: FullBackupPayload): Promise<boolean>;
  exportTableCSV(tableName: 'clients' | 'deliveries' | 'invoices' | 'payments' | 'complaints' | 'products'): Promise<string>;
  syncLocalToCloud?(): Promise<{ clients: number; deliveries: number; invoices: number; payments: number; complaints: number }>;
}

let activeAdapterOverride: IRepository | null = null;

export function setAdapterOverride(adapter: IRepository | null) {
  activeAdapterOverride = adapter;
}

/**
 * Returns the active repository adapter.
 * Uses Supabase adapter only if Supabase is configured AND a user session exists,
 * otherwise defaults cleanly to Local adapter so admin portal is 100% functional without Supabase.
 */
export function getRepo(): IRepository {
  if (activeAdapterOverride) {
    return activeAdapterOverride;
  }

  // Check if Supabase is configured and has an active session
  if (isSupabaseConfigured && supabase) {
    // If we have an active cloud mode flag set by the login session, return supabaseAdapter
    const cloudAuth = localStorage.getItem('alifood_cloud_session');
    if (cloudAuth === 'true') {
      return supabaseAdapter;
    }
  }

  return localAdapter;
}
