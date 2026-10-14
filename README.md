# M/S Ali Food — Enterprise B2B SaaS Estimating, Billing & Client Portal

A lightweight, high-performance, production-ready B2B poultry supplier SaaS platform for **M/S Ali Food** (Proprietor: Al Islam Ridhoy, Dhaka & Chattogram hubs). Built with React 19, TypeScript, Vite, Tailwind CSS, jsPDF, and optional Supabase backend.

Designed to operate seamlessly **with or without a cloud database**:
- **Local Storage Mode (Zero-Config):** 100% of the Super-Admin system functions completely offline using native browser IndexedDB (with localStorage fallback). No database, `.env`, or backend configuration required to create clients, log dispatches, generate invoices, record payments, and export PDF documents.
- **Cloud Mode (Supabase):** Connects to Supabase PostgreSQL with Strict Row Level Security (RLS) for multi-device cross-sync and real-time remote Client Portal access.

---

## 🌟 Key Features & Architecture

### 1. Simplified Public Supplier Website
- **Focus:** Supplier-only B2B brochure answering *Who we are*, *What we do*, and *How to contact us*.
- **Routes:**
  - `/` — Homepage: Hero with company credibility, What We Supply cards, Why Us value propositions, and instant contact strip.
  - `/about` — About Us: Founder background (Al Islam Ridhoy), Dhaka & Chattogram hubs, Halal process & cold-chain guarantees.
  - `/contact` — Contact: Direct tap-to-call hotlines (`+880 1819-253629`, `+880 1711-364255`), email, hub addresses, and WhatsApp enquiry launcher.
  - `/products` — Products: Clean, read-only catalog with supply forms, standard units, and price visibility toggle.
  - Legacy redirects: `/order`, `/supply`, `/partners`, `/faq`, `/products/*` gracefully redirect to `/` or `/products`.

### 2. Super-Admin Portal (`/admin`)
- **Master Authentication:**
  - **Local Mode:** First-run master password creation. Encrypted using browser Web Crypto SHA-256 + 16-byte random salt. Automatically logs out after 30 minutes of inactivity. Emergency reset requires confirming an offline JSON backup.
  - **Cloud Mode:** Supabase Auth email/password login with verified `admin` role.
- **Modules:**
  - **Dashboard:** At-a-glance KPIs (Today's deliveries, Total unpaid, Overdue amount, This month's billed vs collected, Open tickets), quick action modals, top 5 debtors, and a 7-day backup reminder banner.
  - **Clients Directory:** Manage clients (Code `AF-C-XXXX`), credit terms (weekly, monthly, cash), opening balance, and live balance. View comprehensive statement ledger, send WhatsApp statement reminders, create client login credentials, or enter **"View as client"** impersonation mode.
  - **Deliveries (Challans):** Daily dispatch log, calendar date picker, vehicle/driver assignment, item logger with rates, printable Delivery Challan PDF, and 1-click **"Convert delivery(ies) to invoice"** batch action.
  - **Invoices & Billing:** Create manual invoices or consolidate one/many deliveries into a single periodic invoice (`INV-YYYY-XXXX`). Void invoices with audit reason. Generate professional BDT PDF invoices with amount in words, bank details, and payment instructions.
  - **Payments & Receipts:** Record cash, bKash, Nagad, bank transfer, and cheque collections. Automatically recomputes invoice paid amount and marks status (`partial` / `paid`). Generates printable Money Receipt PDF. Undo payment with automatic invoice balance reversal.
  - **Complaints & Quality Tickets:** Kanban board for quality, quantity, late delivery, or billing issues. Real-time conversation thread between client and admin.
  - **Product Catalog:** Manage baseline rates, supply forms, and public price visibility.
  - **Reports & Aging Analysis:** Financial summary, receivables aging breakdown (0–7 days, 8–30 days, 30+ days overdue), and CSV data exports.
  - **Settings & Data Management:** Company information, invoice numbering prefixes, bank/mobile payment details, full JSON backup download/import, and "Push Local Data to Cloud" migration tool.
  - **Activity Log:** Append-only audit trail tracking dispatches, billings, payments, and system changes.

### 3. Client Portal (`/client` & `/client/login`)
- **Direct Login:** Clients log in with their email and password.
- **Account Overview:** Current balance due, total invoices, active deliveries, and payment status.
- **Invoices:** View all issued bills, payment progress bar, and download PDF copies.
- **Deliveries:** Track dispatches with delivery notes and print challans.
- **Statement Ledger:** Complete running balance history (invoices + payments).
- **Support & Quality Tickets:** Raise quality or quantity issues with delivery/invoice tags and exchange messages with Ali Food support.
- **Offline / Local Mode Support:** If running in Local Mode without Supabase, the portal provides a clear notice explaining cloud sync, while the admin can use the **"View as client"** impersonation tool to preview client experiences and generate PDF statements for WhatsApp/email delivery.

---

## 🚀 How to Run & Deploy

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm, pnpm, or yarn

### 1. Local Development
```bash
# Clone the repository
git clone https://github.com/your-org/alifoodweb.git
cd alifoodweb

# Install dependencies (only standard deps + jspdf + jspdf-autotable)
npm install

# Start Vite development server
npm run dev
```
Visit `http://localhost:5173` in your browser.
- Open `/` to browse the public website.
- Open `/admin` to set your initial Super-Admin PIN/password and start managing the business.

### 2. Build for Production
```bash
npm run build
```
This runs `tsc -b && vite build`. Output will be generated in `dist/`.

### 3. Deployment to Vercel
The repository includes `vercel.json` configured with single-page application (SPA) rewrites:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. (Optional) Set Supabase environment variables if using Cloud Mode:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
5. Deploy.

---

## 💾 Backup & Data Safety (Local Mode)

When operating in Local Storage Mode, all data resides in the browser's IndexedDB. To guarantee zero data loss:

1. **Automatic Reminder:** The Admin Dashboard automatically displays a notification banner every 7 days prompting you to download a fresh backup.
2. **Export Full Backup (JSON):**
   - Navigate to `/admin` -> **Settings**.
   - Under **Backup & Restore (Local Storage Mode)**, click **Download Full Backup (JSON)**.
   - Saves a timestamped `alifood_backup_YYYY-MM-DD.json` containing clients, deliveries, invoices, payments, complaints, products, settings, and activity logs.
3. **Restore Backup (JSON):**
   - Click **Select Backup File (.json)**.
   - Choose your JSON backup file and confirm restoration.
4. **Table-level CSV Export:**
   - In **Settings** or **Reports**, click **Export Clients (CSV)**, **Export Invoices (CSV)**, or **Export Payments (CSV)** for spreadsheet analysis in Excel or Google Sheets.

---

## ☁️ 3-Step Supabase Cloud Setup (Optional)

To enable cross-device multi-user synchronization and remote Client Portal logins:

### Step 1: Execute Schema Scripts
In your Supabase project dashboard, navigate to the **SQL Editor**:
1. Run `supabase/schema.sql` (if starting completely fresh; creates base extensions and storage).
2. Run `supabase/billing_schema.sql` (creates idempotent billing tables, RLS policies, trigger functions, and views).

### Step 2: Create First User in Supabase Auth
1. Go to **Authentication** -> **Users** in your Supabase dashboard.
2. Click **Add User** -> **Create User**.
3. Enter your admin email (e.g., `admin@alifoodbd.com`) and a strong password. Click **Create User**.
4. Copy the newly created user's UUID.

### Step 3: Elevate Profile to Super Admin
Open the **SQL Editor** in Supabase and execute:
```sql
-- Replace with your Supabase auth user's UUID:
UPDATE public.profiles
SET role = 'admin',
    full_name = 'M/S Ali Food Administrator'
WHERE id = 'PASTE_YOUR_AUTH_USER_UUID_HERE';
```

### Step 4: Configure Frontend Environment Variables
Create a `.env` file in the project root (or configure variables in Vercel):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
Now, navigating to `/admin` will allow Supabase Cloud authentication. You can also push any existing local data to the cloud using the **"Push Local Data to Cloud"** button in `/admin` Settings.

---

## 🧪 End-to-End Smoke Test Checklist

Follow this quick verification checklist to test the full lifecycle:

### Test Flow (Local Storage Mode)
- [ ] **First-Run Auth:** Navigate to `/admin`. You should see the prompt: *"First Time Setup: Set Master Admin Password"*. Enter a master PIN (e.g. `123456`), confirm, and verify instant dashboard access.
- [ ] **Create Client:** Go to `/admin` -> **Clients** -> click **+ Add Client**. Enter:
  - Name: `The Westin Dhaka (Culinary Dept)`
  - Phone: `01711000000`
  - Credit Terms: `Weekly`
  - Click **Save Client**. Notice code assigned: `AF-C-0001`.
- [ ] **Log Delivery (Dispatch):** Go to **Deliveries** -> click **+ New Delivery**.
  - Select client `The Westin Dhaka`.
  - Add items: `Broiler Whole Cleaned` (100 Kg @ ৳240) and `Sonali Dressed` (50 Kg @ ৳380).
  - Click **Save Delivery**. Verify status is `scheduled` or `delivered`.
  - Click **Print Challan** to verify PDF challan generation with logo, signatures, and terms.
- [ ] **Convert Delivery to Invoice:** In the Deliveries table, select the delivery checkbox and click **Convert Selected to Invoice**.
  - Notice the invoice is pre-filled with items, amounts, subtotal, and due date based on credit terms.
  - Click **Generate Invoice**. An invoice with number `INV-YYYY-XXXX` is created.
  - Click **Download PDF** to verify the BDT invoice format with amount in words and bank details.
- [ ] **Record Partial Payment:** Go to **Invoices** -> click **Record Payment** on the invoice:
  - Total is ৳43,000. Enter Amount: `20,000`, Method: `bKash`, Reference: `TRX987654`.
  - Click **Record Payment**.
  - Verify invoice status changes to `partial`, paid amount displays `৳20,000`, and remaining balance displays `৳23,000`.
  - Click **Download Money Receipt** PDF.
- [ ] **Record Full Payment:** Record another payment of `23,000`.
  - Verify invoice status automatically updates to `paid`.
- [ ] **Quality Complaint:** Go to **Complaints** -> click **+ New Complaint**:
  - File a `quality` complaint tagged to the delivery. Send an admin reply in the conversation thread and mark as `resolved`.
- [ ] **Client Statement & WhatsApp Link:** Return to **Clients** -> click on `The Westin Dhaka`:
  - Review the complete chronological ledger (deliveries, invoices, payments, running balance).
  - Click **Send Statement via WhatsApp** to verify prefilled WhatsApp message formatting with due amount.
- [ ] **Impersonate Client Portal:** On the client detail page, click **View as Client**:
  - Notice the amber notification bar: *"Viewing portal as client: The Westin Dhaka"*.
  - Verify invoices, deliveries, and statements are filtered strictly to this client.
  - Click **Return to Admin Console**.
- [ ] **Backup & Restore:** Go to **Settings** -> click **Download Full Backup (JSON)**. Confirm file downloads cleanly.

---

## 📁 Repository Structure & File Catalog

```
ALIFOODWEB/
├── public/
│   ├── images/              # Optimized brand assets & signatures (<300KB)
│   ├── robots.txt           # Search indexing rules (disallowing /admin and /client)
│   └── sitemap.xml          # 4 clean public routes
├── src/
│   ├── _archive/            # Retired components preserved safely for audit/reuse
│   │   ├── CartContext.tsx
│   │   ├── OrderPage.tsx, SupplyPage.tsx, PartnersPage.tsx, FaqPage.tsx
│   │   └── ... (original order & modal components)
│   ├── components/
│   │   ├── admin/           # Super-Admin modular view components
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminDashboardView.tsx
│   │   │   ├── AdminClientsView.tsx
│   │   │   ├── AdminDeliveriesView.tsx
│   │   │   ├── AdminInvoicesView.tsx
│   │   │   ├── AdminPaymentsView.tsx
│   │   │   ├── AdminComplaintsView.tsx
│   │   │   ├── AdminProductsView.tsx
│   │   │   ├── AdminReportsView.tsx
│   │   │   ├── AdminSettingsView.tsx
│   │   │   └── AdminActivityLogView.tsx
│   │   └── layout/          # Global layout (Navbar, Footer, MobileBottomBar)
│   ├── context/
│   │   └── AdminContext.tsx # Admin auth & impersonation context
│   ├── data/
│   │   ├── companyInfo.ts   # Single source of truth for M/S Ali Food info
│   │   └── initialProducts.ts
│   ├── lib/
│   │   ├── db/              # Repository pattern data layer
│   │   │   ├── types.ts           # Unified TypeScript domain entities
│   │   │   ├── repository.ts      # IRepository contract & getRepo() factory
│   │   │   ├── localAdapter.ts    # Native IndexedDB engine with localStorage fallback
│   │   │   └── supabaseAdapter.ts # Supabase PostgreSQL cloud adapter
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── HomePage.tsx       # Simplified public supplier homepage
│   │   ├── AboutPage.tsx      # Company story, proprietor, hubs, standards
│   │   ├── ContactPage.tsx    # Hotlines, WhatsApp form, hub addresses
│   │   ├── ProductsPage.tsx   # Read-only catalog with rate visibility toggle
│   │   ├── AdminPage.tsx      # Super-Admin management console
│   │   ├── ClientLoginPage.tsx# Client login screen
│   │   └── ClientPortalPage.tsx# Customer account dashboard & statement
│   ├── utils/
│   │   ├── adminAuth.ts       # Web Crypto SHA-256 + salt PIN authentication
│   │   ├── formatters.ts      # BDT currency (৳), date, and number-to-words helpers
│   │   ├── pdfGenerator.ts    # jsPDF invoices, challans, money receipts, statements
│   │   └── whatsapp.ts        # Direct WhatsApp prefilled message launchers
│   ├── App.tsx              # Hand-rolled URL router & dynamic titles
│   └── i18n.ts              # Localization dictionary (English with Bengali readiness)
├── supabase/
│   ├── schema.sql           # Existing base Supabase schema (untouched)
│   └── billing_schema.sql   # Complete billing schema with RLS & triggers
├── tools/                   # Preserved helper scripts & unused test assets
├── vercel.json              # SPA rewrite rule
└── README.md
```

---

## 🔒 Security & Privacy Notice
- **Zero hardcoded credentials:** Passwords and keys have been completely removed.
- **Local Password Encryption:** Local mode hashes passwords using `crypto.subtle.digest('SHA-256')` with an independent 16-byte cryptographically random salt.
- **Strict Row Level Security:** In Cloud Mode, clients can only query rows explicitly matching their assigned `client_id`. Super-admins have full administrative access governed by PostgreSQL security-definer functions.
