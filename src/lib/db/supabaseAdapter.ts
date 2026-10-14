// Supabase Cloud Storage Adapter implementing IRepository
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
  FullBackupPayload,
} from './types';
import { IRepository } from './repository';
import { supabase } from '../supabase';
import { localAdapter } from './localAdapter';

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

// Model mappers
function mapClientFromDB(row: any): Client {
  return {
    id: row.id,
    code: row.code,
    company: row.company,
    contactName: row.contact_name,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    address: row.address,
    city: row.city,
    customerType: row.customer_type,
    creditTerms: row.credit_terms,
    openingBalance: Number(row.opening_balance || 0),
    notes: row.notes,
    active: row.active !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

function mapDeliveryFromDB(row: any, items: any[] = []): Delivery {
  return {
    id: row.id,
    deliveryNumber: row.delivery_number,
    clientId: row.client_id,
    clientName: row.clients?.contact_name,
    clientCompany: row.clients?.company,
    date: row.date,
    vehicleDriver: row.vehicle_driver,
    status: row.status,
    notes: row.notes,
    receivedBy: row.received_by,
    receivedAt: row.received_at,
    invoiceId: row.invoice_id,
    items: (items || []).map((i) => ({
      id: i.id,
      deliveryId: i.delivery_id,
      productId: i.product_id,
      productName: i.product_name,
      qty: Number(i.qty),
      unit: i.unit,
      rate: Number(i.rate),
      amount: Number(i.amount),
    })),
    totalAmount: Number(row.total_amount || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

function mapInvoiceFromDB(row: any, items: any[] = []): Invoice {
  const total = Number(row.total || 0);
  const paidAmount = Number(row.paid_amount || 0);
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    clientId: row.client_id,
    clientName: row.clients?.contact_name,
    clientCompany: row.clients?.company,
    clientPhone: row.clients?.phone,
    clientAddress: row.clients?.address,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    periodFrom: row.period_from,
    periodTo: row.period_to,
    deliveryIds: row.delivery_ids || [],
    items: (items || []).map((i) => ({
      id: i.id,
      invoiceId: i.invoice_id,
      deliveryId: i.delivery_id,
      productName: i.product_name,
      qty: Number(i.qty),
      unit: i.unit,
      rate: Number(i.rate),
      amount: Number(i.amount),
    })),
    subtotal: Number(row.subtotal || 0),
    discount: Number(row.discount || 0),
    deliveryCharge: Number(row.delivery_charge || 0),
    total,
    paidAmount,
    dueAmount: Math.max(0, total - paidAmount),
    status: row.status,
    voidReason: row.void_reason,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

function mapPaymentFromDB(row: any): Payment {
  return {
    id: row.id,
    paymentNumber: row.payment_number,
    clientId: row.client_id,
    clientName: row.clients?.company,
    invoiceId: row.invoice_id,
    invoiceNumber: row.invoices?.invoice_number,
    amount: Number(row.amount || 0),
    method: row.method,
    reference: row.reference,
    date: row.date,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

function mapComplaintFromDB(row: any, messages: any[] = []): Complaint {
  return {
    id: row.id,
    complaintNumber: row.complaint_number,
    clientId: row.client_id,
    clientName: row.clients?.contact_name,
    clientCompany: row.clients?.company,
    invoiceId: row.invoice_id,
    deliveryId: row.delivery_id,
    category: row.category,
    subject: row.subject,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages: (messages || []).map((m) => ({
      id: m.id,
      complaintId: m.complaint_id,
      senderRole: m.sender_role,
      senderName: m.sender_name,
      message: m.message,
      attachmentUrl: m.attachment_url,
      createdAt: m.created_at,
    })),
  };
}

export const supabaseAdapter: IRepository = {
  mode: 'cloud',

  // CLIENTS
  async getClients(includeDeleted = false): Promise<Client[]> {
    const sb = ensureSupabase();
    let query = sb.from('clients').select('*');
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapClientFromDB);
  },

  async getClientById(id: string): Promise<Client | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb.from('clients').select('*').eq('id', id).single();
    if (error || !data) return null;
    return mapClientFromDB(data);
  },

  async saveClient(client: Partial<Client>): Promise<Client> {
    const sb = ensureSupabase();
    const payload: any = {
      company: client.company,
      contact_name: client.contactName,
      phone: client.phone,
      whatsapp: client.whatsapp,
      email: client.email,
      address: client.address,
      city: client.city,
      customer_type: client.customerType,
      credit_terms: client.creditTerms,
      opening_balance: client.openingBalance,
      notes: client.notes,
      active: client.active !== false,
      updated_at: new Date().toISOString(),
    };

    if (client.id) {
      payload.id = client.id;
    }
    if (client.code) {
      payload.code = client.code;
    }

    const { data, error } = await sb.from('clients').upsert(payload).select().single();
    if (error) throw error;
    return mapClientFromDB(data);
  },

  async deleteClient(id: string, soft = true): Promise<void> {
    const sb = ensureSupabase();
    if (soft) {
      await sb.from('clients').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    } else {
      await sb.from('clients').delete().eq('id', id);
    }
  },

  async restoreClient(id: string): Promise<void> {
    const sb = ensureSupabase();
    await sb.from('clients').update({ deleted_at: null }).eq('id', id);
  },

  // PRODUCTS
  async getProducts(): Promise<BillingProduct[]> {
    return localAdapter.getProducts(); // Fallback / shared with product catalog
  },

  async saveProduct(product: Partial<BillingProduct>): Promise<BillingProduct> {
    return localAdapter.saveProduct(product);
  },

  // DELIVERIES
  async getDeliveries(clientId?: string, includeDeleted = false): Promise<Delivery[]> {
    const sb = ensureSupabase();
    let query = sb.from('deliveries').select('*, clients(company, contact_name), delivery_items(*)');
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query.order('date', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => mapDeliveryFromDB(row, row.delivery_items));
  },

  async getDeliveryById(id: string): Promise<Delivery | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('deliveries')
      .select('*, clients(company, contact_name), delivery_items(*)')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return mapDeliveryFromDB(data, data.delivery_items);
  },

  async saveDelivery(delivery: Partial<Delivery>): Promise<Delivery> {
    const sb = ensureSupabase();
    const payload: any = {
      client_id: delivery.clientId,
      date: delivery.date,
      vehicle_driver: delivery.vehicleDriver,
      status: delivery.status,
      notes: delivery.notes,
      received_by: delivery.receivedBy,
      received_at: delivery.receivedAt,
      invoice_id: delivery.invoiceId,
      total_amount: delivery.totalAmount,
      updated_at: new Date().toISOString(),
    };
    if (delivery.id) payload.id = delivery.id;
    if (delivery.deliveryNumber) payload.delivery_number = delivery.deliveryNumber;

    const { data, error } = await sb.from('deliveries').upsert(payload).select().single();
    if (error) throw error;

    // Delivery items
    if (delivery.items) {
      await sb.from('delivery_items').delete().eq('delivery_id', data.id);
      const itemsPayload = delivery.items.map((i) => ({
        delivery_id: data.id,
        product_name: i.productName,
        qty: i.qty,
        unit: i.unit,
        rate: i.rate,
        amount: Math.round(i.qty * i.rate * 100) / 100,
      }));
      if (itemsPayload.length > 0) {
        await sb.from('delivery_items').insert(itemsPayload);
      }
    }

    return this.getDeliveryById(data.id) as Promise<Delivery>;
  },

  async deleteDelivery(id: string, soft = true): Promise<void> {
    const sb = ensureSupabase();
    if (soft) {
      await sb.from('deliveries').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    } else {
      await sb.from('deliveries').delete().eq('id', id);
    }
  },

  async restoreDelivery(id: string): Promise<void> {
    const sb = ensureSupabase();
    await sb.from('deliveries').update({ deleted_at: null }).eq('id', id);
  },

  // INVOICES
  async getInvoices(clientId?: string, includeDeleted = false): Promise<Invoice[]> {
    const sb = ensureSupabase();
    let query = sb.from('invoices').select('*, clients(company, contact_name, phone, address), invoice_items(*)');
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query.order('issue_date', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => mapInvoiceFromDB(row, row.invoice_items));
  },

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('invoices')
      .select('*, clients(company, contact_name, phone, address), invoice_items(*)')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return mapInvoiceFromDB(data, data.invoice_items);
  },

  async saveInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    const sb = ensureSupabase();
    const payload: any = {
      client_id: invoice.clientId,
      issue_date: invoice.issueDate,
      due_date: invoice.dueDate,
      period_from: invoice.periodFrom,
      period_to: invoice.periodTo,
      subtotal: invoice.subtotal,
      discount: invoice.discount || 0,
      delivery_charge: invoice.deliveryCharge || 0,
      total: invoice.total,
      status: invoice.status,
      notes: invoice.notes,
      updated_at: new Date().toISOString(),
    };
    if (invoice.id) payload.id = invoice.id;
    if (invoice.invoiceNumber) payload.invoice_number = invoice.invoiceNumber;

    const { data, error } = await sb.from('invoices').upsert(payload).select().single();
    if (error) throw error;

    // Items
    if (invoice.items) {
      await sb.from('invoice_items').delete().eq('invoice_id', data.id);
      const itemsPayload = invoice.items.map((i) => ({
        invoice_id: data.id,
        delivery_id: i.deliveryId || null,
        product_name: i.productName,
        qty: i.qty,
        unit: i.unit,
        rate: i.rate,
        amount: Math.round(i.qty * i.rate * 100) / 100,
      }));
      if (itemsPayload.length > 0) {
        await sb.from('invoice_items').insert(itemsPayload);
      }
    }

    return this.getInvoiceById(data.id) as Promise<Invoice>;
  },

  async voidInvoice(id: string, reason: string): Promise<Invoice> {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('invoices')
      .update({ status: 'void', void_reason: reason, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapInvoiceFromDB(data);
  },

  async deleteInvoice(id: string, soft = true): Promise<void> {
    const sb = ensureSupabase();
    if (soft) {
      await sb.from('invoices').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    } else {
      await sb.from('invoices').delete().eq('id', id);
    }
  },

  async restoreInvoice(id: string): Promise<void> {
    const sb = ensureSupabase();
    await sb.from('invoices').update({ deleted_at: null }).eq('id', id);
  },

  async convertDeliveriesToInvoice(
    clientId: string,
    deliveryIds: string[],
    dueDate?: string,
    notes?: string
  ): Promise<Invoice> {
    return localAdapter.convertDeliveriesToInvoice(clientId, deliveryIds, dueDate, notes);
  },

  async generateMonthlyInvoices(
    periodFrom: string,
    periodTo: string
  ): Promise<{ created: Invoice[]; errors: string[] }> {
    return localAdapter.generateMonthlyInvoices(periodFrom, periodTo);
  },

  // PAYMENTS
  async getPayments(clientId?: string, includeDeleted = false): Promise<Payment[]> {
    const sb = ensureSupabase();
    let query = sb.from('payments').select('*, clients(company), invoices(invoice_number)');
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query.order('date', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapPaymentFromDB);
  },

  async getPaymentById(id: string): Promise<Payment | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('payments')
      .select('*, clients(company), invoices(invoice_number)')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return mapPaymentFromDB(data);
  },

  async recordPayment(payment: Partial<Payment>): Promise<Payment> {
    const sb = ensureSupabase();
    const payload: any = {
      client_id: payment.clientId,
      invoice_id: payment.invoiceId,
      amount: payment.amount,
      method: payment.method,
      reference: payment.reference,
      date: payment.date,
      note: payment.note,
      updated_at: new Date().toISOString(),
    };
    if (payment.id) payload.id = payment.id;
    if (payment.paymentNumber) payload.payment_number = payment.paymentNumber;

    const { data, error } = await sb.from('payments').upsert(payload).select().single();
    if (error) throw error;
    return mapPaymentFromDB(data);
  },

  async deletePayment(id: string, soft = true): Promise<void> {
    const sb = ensureSupabase();
    if (soft) {
      await sb.from('payments').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    } else {
      await sb.from('payments').delete().eq('id', id);
    }
  },

  async restorePayment(id: string): Promise<void> {
    const sb = ensureSupabase();
    await sb.from('payments').update({ deleted_at: null }).eq('id', id);
  },

  // COMPLAINTS
  async getComplaints(clientId?: string): Promise<Complaint[]> {
    const sb = ensureSupabase();
    let query = sb.from('complaints').select('*, clients(company, contact_name), complaint_messages(*)');
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => mapComplaintFromDB(row, row.complaint_messages));
  },

  async getComplaintById(id: string): Promise<Complaint | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from('complaints')
      .select('*, clients(company, contact_name), complaint_messages(*)')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return mapComplaintFromDB(data, data.complaint_messages);
  },

  async saveComplaint(complaint: Partial<Complaint>): Promise<Complaint> {
    const sb = ensureSupabase();
    const payload: any = {
      client_id: complaint.clientId,
      invoice_id: complaint.invoiceId,
      delivery_id: complaint.deliveryId,
      category: complaint.category,
      subject: complaint.subject,
      status: complaint.status,
      priority: complaint.priority,
      updated_at: new Date().toISOString(),
    };
    if (complaint.id) payload.id = complaint.id;
    if (complaint.complaintNumber) payload.complaint_number = complaint.complaintNumber;

    const { data, error } = await sb.from('complaints').upsert(payload).select().single();
    if (error) throw error;
    return this.getComplaintById(data.id) as Promise<Complaint>;
  },

  async addComplaintMessage(
    complaintId: string,
    msg: { senderRole: 'admin' | 'client'; senderName: string; message: string; attachmentUrl?: string }
  ): Promise<ComplaintMessage> {
    const sb = ensureSupabase();
    const payload = {
      complaint_id: complaintId,
      sender_role: msg.senderRole,
      sender_name: msg.senderName,
      message: msg.message,
      attachment_url: msg.attachmentUrl,
    };
    const { data, error } = await sb.from('complaint_messages').insert(payload).select().single();
    if (error) throw error;
    return {
      id: data.id,
      complaintId: data.complaint_id,
      senderRole: data.sender_role,
      senderName: data.sender_name,
      message: data.message,
      attachmentUrl: data.attachment_url,
      createdAt: data.created_at,
    };
  },

  async updateComplaintStatus(
    id: string,
    status: Complaint['status'],
    priority?: Complaint['priority']
  ): Promise<Complaint> {
    const sb = ensureSupabase();
    const payload: any = { status, updated_at: new Date().toISOString() };
    if (priority) payload.priority = priority;

    const { data, error } = await sb.from('complaints').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return this.getComplaintById(data.id) as Promise<Complaint>;
  },

  // SETTINGS
  async getSettings(): Promise<AppSettings> {
    return localAdapter.getSettings();
  },

  async saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    return localAdapter.saveSettings(settings);
  },

  // ACTIVITY LOGS
  async getActivityLogs(limit = 100): Promise<ActivityLog[]> {
    return localAdapter.getActivityLogs(limit);
  },

  async logActivity(
    action: string,
    entity: ActivityLog['entity'],
    entityId: string,
    description: string,
    performedBy = 'Super Admin'
  ): Promise<void> {
    return localAdapter.logActivity(action, entity, entityId, description, performedBy);
  },

  // LEDGER & METRICS
  async getClientLedger(clientId: string) {
    const client = await this.getClientById(clientId);
    const deliveries = await this.getDeliveries(clientId);
    const invoices = await this.getInvoices(clientId);
    const payments = await this.getPayments(clientId);

    const totalBilled = invoices
      .filter((i) => i.status !== 'void')
      .reduce((s, i) => s + i.total, 0);

    const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
    const opening = client ? client.openingBalance || 0 : 0;
    const runningBalance = opening + totalBilled - totalPaid;

    return {
      client,
      deliveries,
      invoices,
      payments,
      totalBilled,
      totalPaid,
      runningBalance,
    };
  },

  async getDashboardMetrics() {
    const today = new Date().toISOString().split('T')[0];
    const deliveries = await this.getDeliveries();
    const invoices = await this.getInvoices();
    const payments = await this.getPayments();
    const complaints = await this.getComplaints();
    const clients = await this.getClients();

    const todayDeliveries = deliveries.filter((d) => d.date === today);

    let totalUnpaid = 0;
    let overdueAmount = 0;

    for (const inv of invoices) {
      if (inv.status !== 'paid' && inv.status !== 'void') {
        totalUnpaid += inv.dueAmount;
        if (inv.dueDate < today) {
          overdueAmount += inv.dueAmount;
        }
      }
    }

    const currentYearMonth = today.substring(0, 7);
    const monthBilled = invoices
      .filter((i) => i.status !== 'void' && (i.issueDate || '').startsWith(currentYearMonth))
      .reduce((s, i) => s + i.total, 0);

    const monthCollected = payments
      .filter((p) => (p.date || '').startsWith(currentYearMonth))
      .reduce((s, p) => s + p.amount, 0);

    const openComplaintsCount = complaints.filter(
      (c) => c.status === 'open' || c.status === 'in_progress'
    ).length;

    const topDebtors: { client: Client; balance: number }[] = [];
    for (const c of clients) {
      const ledger = await this.getClientLedger(c.id);
      if (ledger.runningBalance > 0) {
        topDebtors.push({ client: c, balance: ledger.runningBalance });
      }
    }
    topDebtors.sort((a, b) => b.balance - a.balance);

    return {
      todayDeliveries,
      totalUnpaid,
      overdueAmount,
      monthBilled,
      monthCollected,
      openComplaintsCount,
      topDebtors: topDebtors.slice(0, 5),
    };
  },

  // BACKUP / EXPORT
  async exportFullBackup(): Promise<FullBackupPayload> {
    return localAdapter.exportFullBackup();
  },

  async importFullBackup(payload: FullBackupPayload): Promise<boolean> {
    return localAdapter.importFullBackup(payload);
  },

  async exportTableCSV(tableName: any): Promise<string> {
    return localAdapter.exportTableCSV(tableName);
  },
};
