// Robust Local Storage Adapter using IndexedDB with localStorage fallback
// Provides 100% offline & local functionality for M/S Ali Food SaaS platform

import {
  Client,
  BillingProduct,
  Delivery,
  Invoice,
  InvoiceItem,
  Payment,
  Complaint,
  ComplaintMessage,
  AppSettings,
  ActivityLog,
  FullBackupPayload,
} from './types';
import { IRepository } from './repository';
import { INITIAL_PRODUCTS } from '../../data/initialProducts';
import { COMPANY_INFO } from '../../data/companyInfo';
import { isSupabaseConfigured, supabase } from '../supabase';

const DB_NAME = 'AliFood_LocalDB_v1';
const DB_VERSION = 1;
const STORES = [
  'clients',
  'products',
  'deliveries',
  'invoices',
  'payments',
  'complaints',
  'settings',
  'activityLogs',
  'meta',
] as const;

type StoreName = (typeof STORES)[number];

// Lightweight native IndexedDB Promise wrapper
class LocalDB {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB not supported in this environment'));
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        STORES.forEach((store) => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.initPromise;
  }

  async getAll<T>(storeName: StoreName): Promise<T[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Fallback to localStorage
      const fallbackKey = `alifood_${storeName}`;
      const data = localStorage.getItem(fallbackKey);
      return data ? JSON.parse(data) : [];
    }
  }

  async get<T>(storeName: StoreName, id: string): Promise<T | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      const all = await this.getAll<any>(storeName);
      return all.find((item) => item.id === id) || null;
    }
  }

  async put<T extends { id: string }>(storeName: StoreName, item: T): Promise<T> {
    try {
      const db = await this.getDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Fallback to localStorage
      const all = await this.getAll<T>(storeName);
      const idx = all.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        all[idx] = item;
      } else {
        all.push(item);
      }
      localStorage.setItem(`alifood_${storeName}`, JSON.stringify(all));
    }
    return item;
  }

  async delete(storeName: StoreName, id: string): Promise<void> {
    try {
      const db = await this.getDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      const all = await this.getAll<any>(storeName);
      const filtered = all.filter((i) => i.id !== id);
      localStorage.setItem(`alifood_${storeName}`, JSON.stringify(filtered));
    }
  }

  async clear(storeName: StoreName): Promise<void> {
    try {
      const db = await this.getDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      localStorage.removeItem(`alifood_${storeName}`);
    }
  }
}

const idb = new LocalDB();

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Default Seed Data
const DEFAULT_SETTINGS: AppSettings = {
  companyName: COMPANY_INFO.name,
  proprietor: COMPANY_INFO.proprietor,
  officialEmail: COMPANY_INFO.email,
  primaryHotline: COMPANY_INFO.hotlines[0].number,
  secondaryHotline: COMPANY_INFO.hotlines[1].number,
  dhakaAddress: COMPANY_INFO.hubs.dhaka.address,
  chattogramAddress: COMPANY_INFO.hubs.chattogram.address,
  invoicePrefix: 'INV',
  deliveryPrefix: 'DL',
  paymentPrefix: 'PAY',
  complaintPrefix: 'CMP',
  clientPrefix: 'AF-C',
  defaultDueDays: 7,
  bankDetails: 'Bank: Dutch-Bangla Bank PLC | A/C Name: M/S Ali Food | A/C No: 123.110.456789 | Branch: Tejgaon, Dhaka',
  bkashNumber: '01319-345501 (Merchant / Agent)',
  nagadNumber: '01401-238019 (Merchant)',
  invoiceFooterText: 'Terms: 100% Halal Manual Slaughter certified. Please verify delivery challan at arrival. Discrepancies must be reported within 24 hours.',
  updatedAt: new Date().toISOString(),
};

const SEED_CLIENTS: Client[] = [
  {
    id: 'cli-aribah',
    code: 'AF-C-0001',
    company: "Aribah's Kitchen",
    contactName: 'Habibul Alom Ridoy',
    phone: '01817-000000',
    whatsapp: '01817-000000',
    email: 'procurement@aribahskitchen.com',
    address: '273/3 West Nakhalpara, Tejgaon, Dhaka-1215',
    city: 'Dhaka',
    customerType: 'Catering',
    creditTerms: 'weekly',
    openingBalance: 0,
    notes: 'Requires vacuum-packed boneless breast fillets in 5kg master bags.',
    active: true,
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'cli-shwapno',
    code: 'AF-C-0002',
    company: 'SHWAPNO (Chattogram Regional)',
    contactName: 'Md Tanjil Hossain',
    phone: '01700-000000',
    whatsapp: '01700-000000',
    email: 'procurement.ctg@shwapno.com',
    address: 'Zakir Hossain Road, North Khulshi, Chattogram',
    city: 'Chattogram',
    customerType: 'Supermarket',
    creditTerms: 'monthly',
    openingBalance: 0,
    notes: 'Supermarket chiller displays with temperature log certification.',
    active: true,
    createdAt: '2026-09-01T09:00:00Z',
    updatedAt: '2026-09-01T09:00:00Z',
  },
  {
    id: 'cli-charulota',
    code: 'AF-C-0003',
    company: 'Charulota Restora',
    contactName: 'Abdur Rahim',
    phone: '01911-000000',
    whatsapp: '01911-000000',
    email: 'purchase@charulota.com',
    address: 'Kawran Bazar Commercial Area, Dhaka',
    city: 'Dhaka',
    customerType: 'Restaurant',
    creditTerms: 'weekly',
    openingBalance: 0,
    notes: 'Daily 24-hr restaurant supply, 8-way curry cut.',
    active: true,
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'cli-velisse',
    code: 'AF-C-0004',
    company: 'Velisse Multicuisine',
    contactName: 'Chef Mahbub',
    phone: '01622-000000',
    whatsapp: '01622-000000',
    email: 'fnb@velissebd.com',
    address: 'Banani Road 11, Dhaka',
    city: 'Dhaka',
    customerType: 'Food Service',
    creditTerms: 'weekly',
    openingBalance: 0,
    notes: 'Fine dining menu cuts, specialty squab and duck portions.',
    active: true,
    createdAt: '2026-09-03T11:00:00Z',
    updatedAt: '2026-09-03T11:00:00Z',
  },
];

let isInitialized = false;

async function ensureSeeded() {
  if (isInitialized) return;

  // Check if clients exists
  const clients = await idb.getAll<Client>('clients');
  if (clients.length === 0) {
    for (const c of SEED_CLIENTS) {
      await idb.put('clients', c);
    }
  }

  // Check if products exists
  const products = await idb.getAll<BillingProduct>('products');
  if (products.length === 0) {
    for (const p of INITIAL_PRODUCTS) {
      const billingProd: BillingProduct = {
        id: p.id,
        sl: p.sl,
        name: p.name,
        slug: p.slug,
        category: p.category,
        categoryName: p.categoryName,
        supplyForm: p.supplyForm,
        unit: p.unit,
        rate: p.rate,
        currency: p.currency || 'BDT ৳',
        priceVisible: p.priceVisible,
        active: p.active,
        minQuantity: p.minQuantity,
        notes: p.processingSpecification,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await idb.put('products', billingProd);
    }
  }

  // Check if settings exists
  const settings = await idb.get<AppSettings>('settings', 'singleton_settings');
  if (!settings) {
    await idb.put('settings', { ...DEFAULT_SETTINGS, id: 'singleton_settings' } as any);
  }

  // Check deliveries/invoices for demonstration data if empty
  const deliveries = await idb.getAll<Delivery>('deliveries');
  if (deliveries.length === 0) {
    const today = new Date().toISOString().split('T')[0];
    const demoDelivery1: Delivery = {
      id: 'del-demo-1',
      deliveryNumber: 'DL-2026-0001',
      clientId: 'cli-aribah',
      clientName: 'Habibul Alom Ridoy',
      clientCompany: "Aribah's Kitchen",
      date: today,
      vehicleDriver: 'Rahman (Pickup Van DH-12)',
      status: 'delivered',
      notes: 'Morning pre-dawn route. 5kg vacuum master packs.',
      receivedBy: 'Ridoy (Kitchen Head)',
      receivedAt: `${today} 06:15 AM`,
      invoiceId: 'inv-demo-1',
      items: [
        {
          id: 'di-1',
          deliveryId: 'del-demo-1',
          productId: 'prod-broiler-breast-boneless',
          productName: 'Broiler Breast Meat (Boneless)',
          qty: 50,
          unit: 'Kg',
          rate: 420,
          amount: 21000,
        },
        {
          id: 'di-2',
          deliveryId: 'del-demo-1',
          productId: 'prod-broiler-drumstick-skinless',
          productName: 'Broiler Drum Stick (Skinless)',
          qty: 40,
          unit: 'Kg',
          rate: 330,
          amount: 13200,
        },
      ],
      totalAmount: 34200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await idb.put('deliveries', demoDelivery1);

    const demoInvoice1: Invoice = {
      id: 'inv-demo-1',
      invoiceNumber: 'INV-2026-0001',
      clientId: 'cli-aribah',
      clientName: 'Habibul Alom Ridoy',
      clientCompany: "Aribah's Kitchen",
      clientPhone: '01817-000000',
      clientAddress: '273/3 West Nakhalpara, Tejgaon, Dhaka-1215',
      issueDate: today,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      periodFrom: today,
      periodTo: today,
      deliveryIds: ['del-demo-1'],
      items: [
        {
          id: 'ii-1',
          invoiceId: 'inv-demo-1',
          deliveryId: 'del-demo-1',
          productName: 'Broiler Breast Meat (Boneless)',
          qty: 50,
          unit: 'Kg',
          rate: 420,
          amount: 21000,
        },
        {
          id: 'ii-2',
          invoiceId: 'inv-demo-1',
          deliveryId: 'del-demo-1',
          productName: 'Broiler Drum Stick (Skinless)',
          qty: 40,
          unit: 'Kg',
          rate: 330,
          amount: 13200,
        },
      ],
      subtotal: 34200,
      discount: 0,
      deliveryCharge: 0,
      total: 34200,
      paidAmount: 15000,
      dueAmount: 19200,
      status: 'partial',
      notes: 'Initial catering cycle delivery invoice.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await idb.put('invoices', demoInvoice1);

    const demoPayment1: Payment = {
      id: 'pay-demo-1',
      paymentNumber: 'PAY-2026-0001',
      clientId: 'cli-aribah',
      clientName: "Aribah's Kitchen",
      invoiceId: 'inv-demo-1',
      invoiceNumber: 'INV-2026-0001',
      amount: 15000,
      method: 'bank',
      reference: 'DBBL Trx #984210',
      date: today,
      note: 'Part payment via bank transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await idb.put('payments', demoPayment1);
  }

  isInitialized = true;
}

// Next sequential number helper
async function getNextNumber(prefix: string, store: StoreName, numberField: string): Promise<string> {
  const all = await idb.getAll<any>(store);
  const year = new Date().getFullYear();
  const pattern = new RegExp(`^${prefix}-${year}-(\\d+)$`);
  let maxSeq = 0;

  for (const item of all) {
    const val = item[numberField];
    if (typeof val === 'string') {
      const match = val.match(pattern);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `${prefix}-${year}-${nextSeq}`;
}

async function getNextClientCode(): Promise<string> {
  const all = await idb.getAll<Client>('clients');
  let maxSeq = 0;
  for (const c of all) {
    const match = (c.code || '').match(/AF-C-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxSeq) maxSeq = num;
    }
  }
  return `AF-C-${String(maxSeq + 1).padStart(4, '0')}`;
}

export const localAdapter: IRepository = {
  mode: 'local',

  // CLIENTS
  async getClients(includeDeleted = false): Promise<Client[]> {
    await ensureSeeded();
    const clients = await idb.getAll<Client>('clients');
    return includeDeleted ? clients : clients.filter((c) => !c.deletedAt);
  },

  async getClientById(id: string): Promise<Client | null> {
    await ensureSeeded();
    return idb.get<Client>('clients', id);
  },

  async saveClient(client: Partial<Client>): Promise<Client> {
    await ensureSeeded();
    const now = new Date().toISOString();
    let saved: Client;

    if (client.id) {
      const existing = (await idb.get<Client>('clients', client.id)) || ({} as Client);
      saved = {
        ...existing,
        ...client,
        updatedAt: now,
      } as Client;
    } else {
      const id = generateUUID();
      const code = client.code || (await getNextClientCode());
      saved = {
        id,
        code,
        company: client.company || '',
        contactName: client.contactName || '',
        phone: client.phone || '',
        whatsapp: client.whatsapp || client.phone || '',
        email: client.email || '',
        address: client.address || '',
        city: client.city || 'Dhaka',
        customerType: client.customerType || 'Restaurant',
        creditTerms: client.creditTerms || 'weekly',
        openingBalance: client.openingBalance || 0,
        notes: client.notes || '',
        active: client.active !== false,
        createdAt: now,
        updatedAt: now,
      };
    }

    await idb.put('clients', saved);
    await this.logActivity(
      client.id ? 'UPDATE_CLIENT' : 'CREATE_CLIENT',
      'client',
      saved.id,
      `Client "${saved.company}" (${saved.code}) saved.`
    );
    return saved;
  },

  async deleteClient(id: string, soft = true): Promise<void> {
    await ensureSeeded();
    if (soft) {
      const existing = await idb.get<Client>('clients', id);
      if (existing) {
        existing.deletedAt = new Date().toISOString();
        existing.updatedAt = new Date().toISOString();
        await idb.put('clients', existing);
      }
    } else {
      await idb.delete('clients', id);
    }
    await this.logActivity('DELETE_CLIENT', 'client', id, `Client ${id} deleted.`);
  },

  async restoreClient(id: string): Promise<void> {
    await ensureSeeded();
    const existing = await idb.get<Client>('clients', id);
    if (existing) {
      existing.deletedAt = null;
      existing.updatedAt = new Date().toISOString();
      await idb.put('clients', existing);
      await this.logActivity('RESTORE_CLIENT', 'client', id, `Client ${existing.company} restored.`);
    }
  },

  // PRODUCTS
  async getProducts(): Promise<BillingProduct[]> {
    await ensureSeeded();
    const list = await idb.getAll<BillingProduct>('products');
    return list.sort((a, b) => a.sl - b.sl);
  },

  async saveProduct(product: Partial<BillingProduct>): Promise<BillingProduct> {
    await ensureSeeded();
    const now = new Date().toISOString();
    let saved: BillingProduct;

    if (product.id) {
      const existing = (await idb.get<BillingProduct>('products', product.id)) || ({} as BillingProduct);
      saved = { ...existing, ...product, updatedAt: now } as BillingProduct;
    } else {
      const id = generateUUID();
      const products = await idb.getAll<BillingProduct>('products');
      const maxSl = products.reduce((m, p) => Math.max(m, p.sl || 0), 0);
      saved = {
        id,
        sl: product.sl || maxSl + 1,
        name: product.name || 'New Product',
        supplyForm: product.supplyForm || 'Chilled/Frozen',
        unit: product.unit || 'Kg',
        rate: product.rate || 0,
        currency: 'BDT ৳',
        priceVisible: product.priceVisible !== false,
        active: product.active !== false,
        notes: product.notes || '',
        createdAt: now,
        updatedAt: now,
      };
    }

    await idb.put('products', saved);
    await this.logActivity('UPDATE_PRODUCT', 'product', saved.id, `Product "${saved.name}" updated.`);
    return saved;
  },

  // DELIVERIES
  async getDeliveries(clientId?: string, includeDeleted = false): Promise<Delivery[]> {
    await ensureSeeded();
    let deliveries = await idb.getAll<Delivery>('deliveries');
    if (!includeDeleted) {
      deliveries = deliveries.filter((d) => !d.deletedAt);
    }
    if (clientId) {
      deliveries = deliveries.filter((d) => d.clientId === clientId);
    }
    return deliveries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getDeliveryById(id: string): Promise<Delivery | null> {
    await ensureSeeded();
    return idb.get<Delivery>('deliveries', id);
  },

  async saveDelivery(delivery: Partial<Delivery>): Promise<Delivery> {
    await ensureSeeded();
    const now = new Date().toISOString();
    let saved: Delivery;

    // Calculate items and total
    const items = (delivery.items || []).map((i) => ({
      ...i,
      id: i.id || generateUUID(),
      deliveryId: delivery.id || '',
      amount: Math.round(i.qty * i.rate * 100) / 100,
    }));
    const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);

    if (delivery.id) {
      const existing = (await idb.get<Delivery>('deliveries', delivery.id)) || ({} as Delivery);
      saved = {
        ...existing,
        ...delivery,
        items,
        totalAmount,
        updatedAt: now,
      } as Delivery;
    } else {
      const id = generateUUID();
      const settings = await this.getSettings();
      const prefix = settings.deliveryPrefix || 'DL';
      const deliveryNumber = delivery.deliveryNumber || (await getNextNumber(prefix, 'deliveries', 'deliveryNumber'));

      // Look up client details
      let clientName = delivery.clientName;
      let clientCompany = delivery.clientCompany;
      if (delivery.clientId) {
        const client = await idb.get<Client>('clients', delivery.clientId);
        if (client) {
          clientName = client.contactName;
          clientCompany = client.company;
        }
      }

      saved = {
        id,
        deliveryNumber,
        clientId: delivery.clientId || '',
        clientName,
        clientCompany,
        date: delivery.date || new Date().toISOString().split('T')[0],
        vehicleDriver: delivery.vehicleDriver || '',
        status: delivery.status || 'scheduled',
        notes: delivery.notes || '',
        receivedBy: delivery.receivedBy || '',
        receivedAt: delivery.receivedAt || '',
        invoiceId: delivery.invoiceId || null,
        items: items.map((i) => ({ ...i, deliveryId: id })),
        totalAmount,
        createdAt: now,
        updatedAt: now,
      };
    }

    await idb.put('deliveries', saved);
    await this.logActivity(
      delivery.id ? 'UPDATE_DELIVERY' : 'CREATE_DELIVERY',
      'delivery',
      saved.id,
      `Delivery ${saved.deliveryNumber} for ${saved.clientCompany || 'Client'} saved.`
    );
    return saved;
  },

  async deleteDelivery(id: string, soft = true): Promise<void> {
    await ensureSeeded();
    if (soft) {
      const existing = await idb.get<Delivery>('deliveries', id);
      if (existing) {
        existing.deletedAt = new Date().toISOString();
        existing.updatedAt = new Date().toISOString();
        await idb.put('deliveries', existing);
      }
    } else {
      await idb.delete('deliveries', id);
    }
    await this.logActivity('DELETE_DELIVERY', 'delivery', id, `Delivery ${id} deleted.`);
  },

  async restoreDelivery(id: string): Promise<void> {
    await ensureSeeded();
    const existing = await idb.get<Delivery>('deliveries', id);
    if (existing) {
      existing.deletedAt = null;
      existing.updatedAt = new Date().toISOString();
      await idb.put('deliveries', existing);
      await this.logActivity('RESTORE_DELIVERY', 'delivery', id, `Delivery ${existing.deliveryNumber} restored.`);
    }
  },

  // INVOICES
  async getInvoices(clientId?: string, includeDeleted = false): Promise<Invoice[]> {
    await ensureSeeded();
    let invoices = await idb.getAll<Invoice>('invoices');
    if (!includeDeleted) {
      invoices = invoices.filter((i) => !i.deletedAt);
    }
    if (clientId) {
      invoices = invoices.filter((i) => i.clientId === clientId);
    }

    // Auto-update overdue status on inspection
    const today = new Date().toISOString().split('T')[0];
    for (const inv of invoices) {
      if (inv.status !== 'paid' && inv.status !== 'void' && inv.status !== 'draft') {
        if (inv.dueDate < today && inv.status !== 'overdue') {
          inv.status = 'overdue';
          await idb.put('invoices', inv);
        }
      }
    }

    return invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  },

  async getInvoiceById(id: string): Promise<Invoice | null> {
    await ensureSeeded();
    return idb.get<Invoice>('invoices', id);
  },

  async saveInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    await ensureSeeded();
    const now = new Date().toISOString();
    let saved: Invoice;

    const items = (invoice.items || []).map((item) => ({
      ...item,
      id: item.id || generateUUID(),
      invoiceId: invoice.id || '',
      amount: Math.round(item.qty * item.rate * 100) / 100,
    }));

    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    const discount = invoice.discount || 0;
    const deliveryCharge = invoice.deliveryCharge || 0;
    const total = Math.max(0, subtotal - discount + deliveryCharge);
    const paidAmount = invoice.paidAmount || 0;
    const dueAmount = Math.max(0, total - paidAmount);

    let status = invoice.status || 'issued';
    if (status !== 'draft' && status !== 'void') {
      if (paidAmount >= total && total > 0) {
        status = 'paid';
      } else if (paidAmount > 0) {
        status = 'partial';
      } else {
        const today = new Date().toISOString().split('T')[0];
        const dueDate = invoice.dueDate || today;
        status = dueDate < today ? 'overdue' : 'issued';
      }
    }

    if (invoice.id) {
      const existing = (await idb.get<Invoice>('invoices', invoice.id)) || ({} as Invoice);
      saved = {
        ...existing,
        ...invoice,
        items,
        subtotal,
        discount,
        deliveryCharge,
        total,
        paidAmount,
        dueAmount,
        status,
        updatedAt: now,
      } as Invoice;
    } else {
      const id = generateUUID();
      const settings = await this.getSettings();
      const prefix = settings.invoicePrefix || 'INV';
      const invoiceNumber = invoice.invoiceNumber || (await getNextNumber(prefix, 'invoices', 'invoiceNumber'));

      // Look up client info
      let clientName = invoice.clientName;
      let clientCompany = invoice.clientCompany;
      let clientPhone = invoice.clientPhone;
      let clientAddress = invoice.clientAddress;

      if (invoice.clientId) {
        const client = await idb.get<Client>('clients', invoice.clientId);
        if (client) {
          clientName = client.contactName;
          clientCompany = client.company;
          clientPhone = client.phone;
          clientAddress = client.address;
        }
      }

      saved = {
        id,
        invoiceNumber,
        clientId: invoice.clientId || '',
        clientName,
        clientCompany,
        clientPhone,
        clientAddress,
        issueDate: invoice.issueDate || new Date().toISOString().split('T')[0],
        dueDate:
          invoice.dueDate ||
          new Date(Date.now() + (settings.defaultDueDays || 7) * 86400000).toISOString().split('T')[0],
        periodFrom: invoice.periodFrom || null,
        periodTo: invoice.periodTo || null,
        deliveryIds: invoice.deliveryIds || [],
        items: items.map((i) => ({ ...i, invoiceId: id })),
        subtotal,
        discount,
        deliveryCharge,
        total,
        paidAmount,
        dueAmount,
        status,
        notes: invoice.notes || '',
        createdAt: now,
        updatedAt: now,
      };
    }

    await idb.put('invoices', saved);

    // If deliveries were attached, update their invoiceId
    if (saved.deliveryIds && saved.deliveryIds.length > 0) {
      for (const dId of saved.deliveryIds) {
        const delivery = await idb.get<Delivery>('deliveries', dId);
        if (delivery && delivery.invoiceId !== saved.id) {
          delivery.invoiceId = saved.id;
          delivery.updatedAt = now;
          await idb.put('deliveries', delivery);
        }
      }
    }

    await this.logActivity(
      invoice.id ? 'UPDATE_INVOICE' : 'CREATE_INVOICE',
      'invoice',
      saved.id,
      `Invoice ${saved.invoiceNumber} for ${saved.clientCompany} saved. Total: ৳${saved.total}`
    );
    return saved;
  },

  async voidInvoice(id: string, reason: string): Promise<Invoice> {
    await ensureSeeded();
    const existing = await idb.get<Invoice>('invoices', id);
    if (!existing) throw new Error('Invoice not found');

    existing.status = 'void';
    existing.voidReason = reason;
    existing.updatedAt = new Date().toISOString();
    await idb.put('invoices', existing);

    // Detach deliveries if any
    if (existing.deliveryIds) {
      for (const dId of existing.deliveryIds) {
        const d = await idb.get<Delivery>('deliveries', dId);
        if (d && d.invoiceId === id) {
          d.invoiceId = null;
          await idb.put('deliveries', d);
        }
      }
    }

    await this.logActivity('VOID_INVOICE', 'invoice', id, `Invoice ${existing.invoiceNumber} voided. Reason: ${reason}`);
    return existing;
  },

  async deleteInvoice(id: string, soft = true): Promise<void> {
    await ensureSeeded();
    if (soft) {
      const existing = await idb.get<Invoice>('invoices', id);
      if (existing) {
        existing.deletedAt = new Date().toISOString();
        existing.updatedAt = new Date().toISOString();
        await idb.put('invoices', existing);
      }
    } else {
      await idb.delete('invoices', id);
    }
    await this.logActivity('DELETE_INVOICE', 'invoice', id, `Invoice ${id} deleted.`);
  },

  async restoreInvoice(id: string): Promise<void> {
    await ensureSeeded();
    const existing = await idb.get<Invoice>('invoices', id);
    if (existing) {
      existing.deletedAt = null;
      existing.updatedAt = new Date().toISOString();
      await idb.put('invoices', existing);
      await this.logActivity('RESTORE_INVOICE', 'invoice', id, `Invoice ${existing.invoiceNumber} restored.`);
    }
  },

  async convertDeliveriesToInvoice(
    clientId: string,
    deliveryIds: string[],
    dueDate?: string,
    notes?: string
  ): Promise<Invoice> {
    await ensureSeeded();
    const client = await idb.get<Client>('clients', clientId);
    if (!client) throw new Error('Client not found');

    const deliveries: Delivery[] = [];
    for (const dId of deliveryIds) {
      const d = await idb.get<Delivery>('deliveries', dId);
      if (d && !d.deletedAt) deliveries.push(d);
    }

    if (deliveries.length === 0) {
      throw new Error('No valid deliveries selected for conversion');
    }

    // Consolidate delivery items
    const invoiceItems: InvoiceItem[] = [];
    let periodFrom: string | null = null;
    let periodTo: string | null = null;

    for (const del of deliveries) {
      if (!periodFrom || del.date < periodFrom) periodFrom = del.date;
      if (!periodTo || del.date > periodTo) periodTo = del.date;

      for (const item of del.items) {
        invoiceItems.push({
          id: generateUUID(),
          invoiceId: '',
          deliveryId: del.id,
          productName: `${item.productName} (${del.deliveryNumber})`,
          qty: item.qty,
          unit: item.unit,
          rate: item.rate,
          amount: item.amount,
        });
      }
    }

    const today = new Date().toISOString().split('T')[0];
    const settings = await this.getSettings();
    const resolvedDueDate =
      dueDate ||
      new Date(Date.now() + (settings.defaultDueDays || 7) * 86400000).toISOString().split('T')[0];

    const invoice = await this.saveInvoice({
      clientId,
      clientName: client.contactName,
      clientCompany: client.company,
      clientPhone: client.phone,
      clientAddress: client.address,
      issueDate: today,
      dueDate: resolvedDueDate,
      periodFrom,
      periodTo,
      deliveryIds,
      items: invoiceItems,
      discount: 0,
      deliveryCharge: 0,
      status: 'issued',
      notes: notes || `Statement Invoice for ${deliveries.length} delivery(ies) between ${periodFrom} and ${periodTo}.`,
    });

    return invoice;
  },

  async generateMonthlyInvoices(
    periodFrom: string,
    periodTo: string
  ): Promise<{ created: Invoice[]; errors: string[] }> {
    await ensureSeeded();
    const created: Invoice[] = [];
    const errors: string[] = [];

    const clients = await this.getClients();
    const allDeliveries = await this.getDeliveries();

    for (const client of clients) {
      try {
        // Find un-invoiced deliveries in date range for this client
        const clientDels = allDeliveries.filter(
          (d) =>
            d.clientId === client.id &&
            !d.invoiceId &&
            d.status === 'delivered' &&
            d.date >= periodFrom &&
            d.date <= periodTo
        );

        if (clientDels.length > 0) {
          const inv = await this.convertDeliveriesToInvoice(
            client.id,
            clientDels.map((d) => d.id),
            undefined,
            `Monthly Statement Invoice for period ${periodFrom} to ${periodTo}`
          );
          created.push(inv);
        }
      } catch (err: any) {
        errors.push(`Failed for client ${client.company}: ${err.message || String(err)}`);
      }
    }

    return { created, errors };
  },

  // PAYMENTS
  async getPayments(clientId?: string, includeDeleted = false): Promise<Payment[]> {
    await ensureSeeded();
    let payments = await idb.getAll<Payment>('payments');
    if (!includeDeleted) {
      payments = payments.filter((p) => !p.deletedAt);
    }
    if (clientId) {
      payments = payments.filter((p) => p.clientId === clientId);
    }
    return payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getPaymentById(id: string): Promise<Payment | null> {
    await ensureSeeded();
    return idb.get<Payment>('payments', id);
  },

  async recordPayment(payment: Partial<Payment>): Promise<Payment> {
    await ensureSeeded();
    const now = new Date().toISOString();
    let saved: Payment;

    const settings = await this.getSettings();
    const prefix = settings.paymentPrefix || 'PAY';
    const paymentNumber = payment.paymentNumber || (await getNextNumber(prefix, 'payments', 'paymentNumber'));

    let clientName = payment.clientName;
    if (payment.clientId) {
      const client = await idb.get<Client>('clients', payment.clientId);
      if (client) clientName = client.company;
    }

    const id = payment.id || generateUUID();
    saved = {
      id,
      paymentNumber,
      clientId: payment.clientId || '',
      clientName,
      invoiceId: payment.invoiceId || null,
      invoiceNumber: payment.invoiceNumber,
      amount: Math.round((payment.amount || 0) * 100) / 100,
      method: payment.method || 'cash',
      reference: payment.reference || '',
      date: payment.date || new Date().toISOString().split('T')[0],
      note: payment.note || '',
      createdAt: now,
      updatedAt: now,
    };

    await idb.put('payments', saved);

    // Apply payment to invoice
    if (saved.invoiceId) {
      const inv = await idb.get<Invoice>('invoices', saved.invoiceId);
      if (inv) {
        // Recompute all payments for this invoice
        const allPayments = await idb.getAll<Payment>('payments');
        const invPayments = allPayments.filter((p) => p.invoiceId === inv.id && !p.deletedAt);
        const totalPaid = invPayments.reduce((s, p) => s + p.amount, 0);

        inv.paidAmount = totalPaid;
        inv.dueAmount = Math.max(0, inv.total - totalPaid);
        if (inv.paidAmount >= inv.total && inv.total > 0) {
          inv.status = 'paid';
        } else if (inv.paidAmount > 0) {
          inv.status = 'partial';
        }
        inv.updatedAt = now;
        await idb.put('invoices', inv);
      }
    } else if (saved.clientId) {
      // Auto-allocate oldest unpaid invoice if no invoice was specified
      const unpaidInvoices = (await this.getInvoices(saved.clientId)).filter(
        (i) => (i.status === 'issued' || i.status === 'partial' || i.status === 'overdue') && i.dueAmount > 0
      );
      unpaidInvoices.sort((a, b) => new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime());

      let remaining = saved.amount;
      for (const inv of unpaidInvoices) {
        if (remaining <= 0) break;
        const alloc = Math.min(remaining, inv.dueAmount);
        inv.paidAmount += alloc;
        inv.dueAmount -= alloc;
        remaining -= alloc;
        if (inv.dueAmount === 0) {
          inv.status = 'paid';
        } else {
          inv.status = 'partial';
        }
        inv.updatedAt = now;
        await idb.put('invoices', inv);
      }
    }

    await this.logActivity(
      'RECORD_PAYMENT',
      'payment',
      saved.id,
      `Payment ${saved.paymentNumber} of ৳${saved.amount} recorded for ${saved.clientName}.`
    );
    return saved;
  },

  async deletePayment(id: string, soft = true): Promise<void> {
    await ensureSeeded();
    const existing = await idb.get<Payment>('payments', id);
    if (!existing) return;

    if (soft) {
      existing.deletedAt = new Date().toISOString();
      existing.updatedAt = new Date().toISOString();
      await idb.put('payments', existing);
    } else {
      await idb.delete('payments', id);
    }

    // Re-adjust invoice if payment was attached
    if (existing.invoiceId) {
      const inv = await idb.get<Invoice>('invoices', existing.invoiceId);
      if (inv) {
        const allPayments = await idb.getAll<Payment>('payments');
        const remainingPayments = allPayments.filter((p) => p.invoiceId === inv.id && !p.deletedAt);
        const totalPaid = remainingPayments.reduce((s, p) => s + p.amount, 0);

        inv.paidAmount = totalPaid;
        inv.dueAmount = Math.max(0, inv.total - totalPaid);
        if (inv.paidAmount >= inv.total && inv.total > 0) {
          inv.status = 'paid';
        } else if (inv.paidAmount > 0) {
          inv.status = 'partial';
        } else {
          const today = new Date().toISOString().split('T')[0];
          inv.status = inv.dueDate < today ? 'overdue' : 'issued';
        }
        await idb.put('invoices', inv);
      }
    }

    await this.logActivity('DELETE_PAYMENT', 'payment', id, `Payment ${id} cancelled/soft-deleted.`);
  },

  async restorePayment(id: string): Promise<void> {
    await ensureSeeded();
    const existing = await idb.get<Payment>('payments', id);
    if (existing) {
      existing.deletedAt = null;
      existing.updatedAt = new Date().toISOString();
      await idb.put('payments', existing);
      await this.logActivity('RESTORE_PAYMENT', 'payment', id, `Payment ${existing.paymentNumber} restored.`);
    }
  },

  // COMPLAINTS
  async getComplaints(clientId?: string): Promise<Complaint[]> {
    await ensureSeeded();
    let complaints = await idb.getAll<Complaint>('complaints');
    if (clientId) {
      complaints = complaints.filter((c) => c.clientId === clientId);
    }
    return complaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getComplaintById(id: string): Promise<Complaint | null> {
    await ensureSeeded();
    return idb.get<Complaint>('complaints', id);
  },

  async saveComplaint(complaint: Partial<Complaint>): Promise<Complaint> {
    await ensureSeeded();
    const now = new Date().toISOString();
    let saved: Complaint;

    if (complaint.id) {
      const existing = (await idb.get<Complaint>('complaints', complaint.id)) || ({} as Complaint);
      saved = { ...existing, ...complaint, updatedAt: now } as Complaint;
    } else {
      const id = generateUUID();
      const settings = await this.getSettings();
      const prefix = settings.complaintPrefix || 'CMP';
      const complaintNumber =
        complaint.complaintNumber || (await getNextNumber(prefix, 'complaints', 'complaintNumber'));

      let clientName = complaint.clientName;
      let clientCompany = complaint.clientCompany;
      if (complaint.clientId) {
        const client = await idb.get<Client>('clients', complaint.clientId);
        if (client) {
          clientName = client.contactName;
          clientCompany = client.company;
        }
      }

      saved = {
        id,
        complaintNumber,
        clientId: complaint.clientId || '',
        clientName,
        clientCompany,
        invoiceId: complaint.invoiceId || null,
        deliveryId: complaint.deliveryId || null,
        category: complaint.category || 'quality',
        subject: complaint.subject || 'Complaint',
        status: complaint.status || 'open',
        priority: complaint.priority || 'medium',
        createdAt: now,
        updatedAt: now,
        messages: complaint.messages || [],
      };
    }

    await idb.put('complaints', saved);
    await this.logActivity(
      'CREATE_COMPLAINT',
      'complaint',
      saved.id,
      `Complaint ${saved.complaintNumber} (${saved.subject}) logged.`
    );
    return saved;
  },

  async addComplaintMessage(
    complaintId: string,
    msg: { senderRole: 'admin' | 'client'; senderName: string; message: string; attachmentUrl?: string }
  ): Promise<ComplaintMessage> {
    await ensureSeeded();
    const complaint = await idb.get<Complaint>('complaints', complaintId);
    if (!complaint) throw new Error('Complaint not found');

    const newMsg: ComplaintMessage = {
      id: generateUUID(),
      complaintId,
      senderRole: msg.senderRole,
      senderName: msg.senderName,
      message: msg.message,
      attachmentUrl: msg.attachmentUrl,
      createdAt: new Date().toISOString(),
    };

    complaint.messages = [...(complaint.messages || []), newMsg];
    complaint.updatedAt = new Date().toISOString();
    if (msg.senderRole === 'client' && complaint.status === 'resolved') {
      complaint.status = 'in_progress'; // Re-open on client reply
    }

    await idb.put('complaints', complaint);
    return newMsg;
  },

  async updateComplaintStatus(
    id: string,
    status: Complaint['status'],
    priority?: Complaint['priority']
  ): Promise<Complaint> {
    await ensureSeeded();
    const complaint = await idb.get<Complaint>('complaints', id);
    if (!complaint) throw new Error('Complaint not found');

    complaint.status = status;
    if (priority) complaint.priority = priority;
    complaint.updatedAt = new Date().toISOString();
    await idb.put('complaints', complaint);

    await this.logActivity(
      'UPDATE_COMPLAINT_STATUS',
      'complaint',
      id,
      `Complaint ${complaint.complaintNumber} status changed to ${status}.`
    );
    return complaint;
  },

  // SETTINGS
  async getSettings(): Promise<AppSettings> {
    await ensureSeeded();
    const settings = await idb.get<AppSettings>('settings', 'singleton_settings');
    return settings || DEFAULT_SETTINGS;
  },

  async saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    await ensureSeeded();
    const existing = await this.getSettings();
    const updated: AppSettings = {
      ...existing,
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    await idb.put('settings', { ...updated, id: 'singleton_settings' } as any);
    await this.logActivity('UPDATE_SETTINGS', 'settings', 'singleton_settings', 'Company settings updated.');
    return updated;
  },

  // ACTIVITY LOGS
  async getActivityLogs(limit = 100): Promise<ActivityLog[]> {
    await ensureSeeded();
    const logs = await idb.getAll<ActivityLog>('activityLogs');
    return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
  },

  async logActivity(
    action: string,
    entity: ActivityLog['entity'],
    entityId: string,
    description: string,
    performedBy = 'Super Admin'
  ): Promise<void> {
    const log: ActivityLog = {
      id: generateUUID(),
      action,
      entity,
      entityId,
      description,
      performedBy,
      createdAt: new Date().toISOString(),
    };
    await idb.put('activityLogs', log);
  },

  // LEDGER & METRICS
  async getClientLedger(clientId: string) {
    await ensureSeeded();
    const client = await idb.get<Client>('clients', clientId);
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
    await ensureSeeded();
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

    const currentYearMonth = today.substring(0, 7); // YYYY-MM
    const monthBilled = invoices
      .filter((i) => i.status !== 'void' && (i.issueDate || '').startsWith(currentYearMonth))
      .reduce((s, i) => s + i.total, 0);

    const monthCollected = payments
      .filter((p) => (p.date || '').startsWith(currentYearMonth))
      .reduce((s, p) => s + p.amount, 0);

    const openComplaintsCount = complaints.filter(
      (c) => c.status === 'open' || c.status === 'in_progress'
    ).length;

    // Calculate debtors
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

  // BACKUP & RESTORE & CSV
  async exportFullBackup(): Promise<FullBackupPayload> {
    await ensureSeeded();
    const clients = await idb.getAll<Client>('clients');
    const products = await idb.getAll<BillingProduct>('products');
    const deliveries = await idb.getAll<Delivery>('deliveries');
    const invoices = await idb.getAll<Invoice>('invoices');
    const payments = await idb.getAll<Payment>('payments');
    const complaints = await idb.getAll<Complaint>('complaints');
    const settings = await this.getSettings();
    const activityLogs = await idb.getAll<ActivityLog>('activityLogs');

    return {
      version: '1.0',
      appName: 'M/S Ali Food SaaS Platform',
      exportedAt: new Date().toISOString(),
      data: {
        clients,
        products,
        deliveries,
        invoices,
        payments,
        complaints,
        settings,
        activityLogs,
      },
    };
  },

  async importFullBackup(payload: FullBackupPayload): Promise<boolean> {
    if (!payload || !payload.data) {
      throw new Error('Invalid backup payload format');
    }

    const { clients, products, deliveries, invoices, payments, complaints, settings, activityLogs } =
      payload.data;

    if (clients) {
      await idb.clear('clients');
      for (const c of clients) await idb.put('clients', c);
    }
    if (products) {
      await idb.clear('products');
      for (const p of products) await idb.put('products', p);
    }
    if (deliveries) {
      await idb.clear('deliveries');
      for (const d of deliveries) await idb.put('deliveries', d);
    }
    if (invoices) {
      await idb.clear('invoices');
      for (const i of invoices) await idb.put('invoices', i);
    }
    if (payments) {
      await idb.clear('payments');
      for (const pay of payments) await idb.put('payments', pay);
    }
    if (complaints) {
      await idb.clear('complaints');
      for (const cmp of complaints) await idb.put('complaints', cmp);
    }
    if (settings) {
      await idb.put('settings', { ...settings, id: 'singleton_settings' } as any);
    }
    if (activityLogs) {
      await idb.clear('activityLogs');
      for (const l of activityLogs) await idb.put('activityLogs', l);
    }

    await this.logActivity('IMPORT_BACKUP', 'settings', 'singleton_settings', 'Full JSON database backup imported.');
    return true;
  },

  async exportTableCSV(
    tableName: 'clients' | 'deliveries' | 'invoices' | 'payments' | 'complaints' | 'products'
  ): Promise<string> {
    await ensureSeeded();
    const data = await idb.getAll<any>(tableName);
    if (data.length === 0) return 'No records found';

    // Flatten simple objects for CSV export
    const headers = Object.keys(data[0]).filter(
      (k) => typeof data[0][k] !== 'object' || data[0][k] === null
    );

    const csvRows = [headers.join(',')];
    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  },

  async syncLocalToCloud() {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.');
    }

    const clients = await this.getClients();
    const deliveries = await this.getDeliveries();
    const invoices = await this.getInvoices();
    const payments = await this.getPayments();
    const complaints = await this.getComplaints();

    // Push clients
    for (const c of clients) {
      await supabase.from('clients').upsert({
        id: c.id,
        code: c.code,
        company: c.company,
        contact_name: c.contactName,
        phone: c.phone,
        whatsapp: c.whatsapp,
        email: c.email,
        address: c.address,
        city: c.city,
        customer_type: c.customerType,
        credit_terms: c.creditTerms,
        opening_balance: c.openingBalance,
        notes: c.notes,
        active: c.active,
        created_at: c.createdAt,
        updated_at: c.updatedAt,
      });
    }

    // Push deliveries
    for (const d of deliveries) {
      await supabase.from('deliveries').upsert({
        id: d.id,
        delivery_number: d.deliveryNumber,
        client_id: d.clientId,
        date: d.date,
        vehicle_driver: d.vehicleDriver,
        status: d.status,
        notes: d.notes,
        received_by: d.receivedBy,
        invoice_id: d.invoiceId,
        total_amount: d.totalAmount,
        created_at: d.createdAt,
        updated_at: d.updatedAt,
      });
      // Delivery items
      for (const item of d.items) {
        await supabase.from('delivery_items').upsert({
          id: item.id,
          delivery_id: d.id,
          product_name: item.productName,
          qty: item.qty,
          unit: item.unit,
          rate: item.rate,
          amount: item.amount,
        });
      }
    }

    // Push invoices
    for (const inv of invoices) {
      await supabase.from('invoices').upsert({
        id: inv.id,
        invoice_number: inv.invoiceNumber,
        client_id: inv.clientId,
        issue_date: inv.issueDate,
        due_date: inv.dueDate,
        period_from: inv.periodFrom,
        period_to: inv.periodTo,
        subtotal: inv.subtotal,
        discount: inv.discount,
        delivery_charge: inv.deliveryCharge,
        total: inv.total,
        paid_amount: inv.paidAmount,
        status: inv.status,
        void_reason: inv.voidReason,
        notes: inv.notes,
        created_at: inv.createdAt,
        updated_at: inv.updatedAt,
      });
      for (const item of inv.items) {
        await supabase.from('invoice_items').upsert({
          id: item.id,
          invoice_id: inv.id,
          delivery_id: item.deliveryId,
          product_name: item.productName,
          qty: item.qty,
          unit: item.unit,
          rate: item.rate,
          amount: item.amount,
        });
      }
    }

    // Push payments
    for (const p of payments) {
      await supabase.from('payments').upsert({
        id: p.id,
        payment_number: p.paymentNumber,
        client_id: p.clientId,
        invoice_id: p.invoiceId,
        amount: p.amount,
        method: p.method,
        reference: p.reference,
        date: p.date,
        note: p.note,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
      });
    }

    // Push complaints
    for (const cmp of complaints) {
      await supabase.from('complaints').upsert({
        id: cmp.id,
        complaint_number: cmp.complaintNumber,
        client_id: cmp.clientId,
        invoice_id: cmp.invoiceId,
        delivery_id: cmp.deliveryId,
        category: cmp.category,
        subject: cmp.subject,
        status: cmp.status,
        priority: cmp.priority,
        created_at: cmp.createdAt,
        updated_at: cmp.updatedAt,
      });
      for (const m of cmp.messages) {
        await supabase.from('complaint_messages').upsert({
          id: m.id,
          complaint_id: cmp.id,
          sender_role: m.senderRole,
          sender_name: m.senderName,
          message: m.message,
          attachment_url: m.attachmentUrl,
          created_at: m.createdAt,
        });
      }
    }

    return {
      clients: clients.length,
      deliveries: deliveries.length,
      invoices: invoices.length,
      payments: payments.length,
      complaints: complaints.length,
    };
  },
};
