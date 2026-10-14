// Core data models for M/S Ali Food Billing & Portal System
// Designed to support both Local (IndexedDB/localStorage) and Cloud (Supabase) seamlessly

export type CustomerType = 
  | 'Restaurant'
  | 'Catering'
  | 'Supermarket'
  | 'Corporate Kitchen'
  | 'Food Service'
  | 'Wholesale Buyer'
  | 'Other';

export type CreditTerms = 'weekly' | 'monthly' | 'cash';

export interface Client {
  id: string; // UUID
  code: string; // e.g. AF-C-0001
  company: string;
  contactName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  city: 'Dhaka' | 'Chattogram' | string;
  customerType: CustomerType;
  creditTerms: CreditTerms;
  openingBalance: number; // in Taka (integer/fixed 2 decimals)
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  deletedAt?: string | null;
}

export interface BillingProduct {
  id: string;
  sl: number;
  name: string;
  slug?: string;
  category?: string;
  categoryName?: string;
  supplyForm: string;
  unit: string; // 'Kg' | 'Piece'
  rate: number;
  currency: string;
  priceVisible: boolean;
  active: boolean;
  minQuantity?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DeliveryStatus = 'scheduled' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface DeliveryItem {
  id: string;
  deliveryId: string;
  productId?: string;
  productName: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface Delivery {
  id: string; // UUID
  deliveryNumber: string; // DL-YYYY-0001
  clientId: string;
  clientName?: string;
  clientCompany?: string;
  date: string; // YYYY-MM-DD
  vehicleDriver?: string;
  status: DeliveryStatus;
  notes?: string;
  receivedBy?: string;
  receivedAt?: string;
  invoiceId?: string | null;
  items: DeliveryItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  deletedAt?: string | null;
}

export type InvoiceStatus = 'draft' | 'issued' | 'partial' | 'paid' | 'overdue' | 'void';

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  deliveryId?: string | null;
  productName: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string; // UUID
  invoiceNumber: string; // INV-YYYY-0001
  clientId: string;
  clientName?: string;
  clientCompany?: string;
  clientPhone?: string;
  clientAddress?: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  periodFrom?: string | null; // For weekly/monthly billing statements
  periodTo?: string | null;
  deliveryIds?: string[];
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  status: InvoiceStatus;
  voidReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  deletedAt?: string | null;
}

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'bank' | 'cheque';

export interface Payment {
  id: string; // UUID
  paymentNumber: string; // PAY-YYYY-0001
  clientId: string;
  clientName?: string;
  invoiceId?: string | null; // null if unallocated on-account payment
  invoiceNumber?: string;
  amount: number;
  method: PaymentMethod;
  reference?: string; // TrxID, Cheque #, Bank deposit slip
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  deletedAt?: string | null;
}

export type ComplaintCategory = 'quality' | 'quantity' | 'late' | 'billing' | 'other';
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ComplaintMessage {
  id: string;
  complaintId: string;
  senderRole: 'admin' | 'client';
  senderName: string;
  message: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface Complaint {
  id: string; // UUID
  complaintNumber: string; // CMP-YYYY-0001
  clientId: string;
  clientName?: string;
  clientCompany?: string;
  invoiceId?: string | null;
  deliveryId?: string | null;
  category: ComplaintCategory;
  subject: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  createdAt: string;
  updatedAt: string;
  messages: ComplaintMessage[];
}

export interface AppSettings {
  companyName: string;
  proprietor: string;
  officialEmail: string;
  primaryHotline: string;
  secondaryHotline: string;
  dhakaAddress: string;
  chattogramAddress: string;
  invoicePrefix: string;
  deliveryPrefix: string;
  paymentPrefix: string;
  complaintPrefix: string;
  clientPrefix: string;
  defaultDueDays: number;
  bankDetails: string;
  bkashNumber: string;
  nagadNumber: string;
  invoiceFooterText: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: 'client' | 'delivery' | 'invoice' | 'payment' | 'complaint' | 'product' | 'settings' | 'auth';
  entityId: string;
  description: string;
  performedBy: string;
  createdAt: string;
}

export interface UserProfile {
  id: string; // matches Supabase auth.users.id
  role: 'admin' | 'client';
  clientId?: string | null;
  fullName: string;
  phone: string;
  email?: string;
}

export interface FullBackupPayload {
  version: string;
  exportedAt: string;
  appName: string;
  data: {
    clients: Client[];
    products: BillingProduct[];
    deliveries: Delivery[];
    invoices: Invoice[];
    payments: Payment[];
    complaints: Complaint[];
    settings: AppSettings;
    activityLogs: ActivityLog[];
  };
}
