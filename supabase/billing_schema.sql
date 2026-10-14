-- ==============================================================================
-- M/S ALI FOOD - B2B CLIENT PORTAL & BILLING SYSTEM SCHEMA (SUPABASE READY)
-- Record Reference: AF/CORP/2026 | Vendor Code: AF-INST-2026/09
-- ==============================================================================
-- This schema is idempotent and safe to run multiple times.
-- Does not touch existing tables from schema.sql.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Supabase Auth Integration)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
    client_id UUID, -- References public.clients(id) once created
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. CLIENTS TABLE (B2B Commercial Accounts)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. AF-C-0001
    company VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    address TEXT NOT NULL,
    city VARCHAR(100) DEFAULT 'Dhaka' NOT NULL,
    customer_type VARCHAR(100) DEFAULT 'Restaurant' NOT NULL, -- Restaurant, Catering, Supermarket, Corporate Kitchen, etc.
    credit_terms VARCHAR(50) DEFAULT 'weekly' NOT NULL CHECK (credit_terms IN ('weekly', 'monthly', 'cash')),
    opening_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    notes TEXT,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Foreign key link from profiles.client_id -> clients.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_profiles_client'
    ) THEN
        ALTER TABLE public.profiles
        ADD CONSTRAINT fk_profiles_client
        FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. PRODUCTS BILLING TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products_billing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sl INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    category VARCHAR(100),
    category_name VARCHAR(255),
    supply_form VARCHAR(100) NOT NULL,
    unit VARCHAR(50) DEFAULT 'Kg' NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(20) DEFAULT 'BDT ৳' NOT NULL,
    price_visible BOOLEAN DEFAULT TRUE NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    min_quantity NUMERIC(10, 2) DEFAULT 5,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. DELIVERIES TABLE (Daily Pre-dawn Route Dispatch & Challans)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_number VARCHAR(50) UNIQUE NOT NULL, -- DL-YYYY-0001
    client_id UUID REFERENCES public.clients(id) ON DELETE RESTRICT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    vehicle_driver VARCHAR(255),
    status VARCHAR(50) DEFAULT 'scheduled' NOT NULL CHECK (status IN ('scheduled', 'out_for_delivery', 'delivered', 'cancelled')),
    notes TEXT,
    received_by VARCHAR(255),
    received_at VARCHAR(100),
    invoice_id UUID, -- Nullable until invoiced
    total_amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- ------------------------------------------------------------------------------
-- 5. DELIVERY ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID REFERENCES public.deliveries(id) ON DELETE CASCADE NOT NULL,
    product_id VARCHAR(100),
    product_name VARCHAR(255) NOT NULL,
    qty NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'Kg' NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. INVOICES TABLE (Weekly / Monthly Billing Statements)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL, -- INV-YYYY-0001
    client_id UUID REFERENCES public.clients(id) ON DELETE RESTRICT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    period_from DATE,
    period_to DATE,
    delivery_ids TEXT[],
    subtotal NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    discount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    delivery_charge NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    total NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    paid_amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' NOT NULL CHECK (status IN ('draft', 'issued', 'partial', 'paid', 'overdue', 'void')),
    void_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Link deliveries.invoice_id -> invoices.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_deliveries_invoice'
    ) THEN
        ALTER TABLE public.deliveries
        ADD CONSTRAINT fk_deliveries_invoice
        FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 7. INVOICE ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
    delivery_id UUID REFERENCES public.deliveries(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    qty NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'Kg' NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 8. PAYMENTS TABLE (Collections & Allocations)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_number VARCHAR(50) UNIQUE NOT NULL, -- PAY-YYYY-0001
    client_id UUID REFERENCES public.clients(id) ON DELETE RESTRICT NOT NULL,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    method VARCHAR(50) NOT NULL CHECK (method IN ('cash', 'bkash', 'nagad', 'bank', 'cheque')),
    reference VARCHAR(255), -- TrxID, Bank ref, Cheque number
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- ------------------------------------------------------------------------------
-- 9. COMPLAINTS & TICKETS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_number VARCHAR(50) UNIQUE NOT NULL, -- CMP-YYYY-0001
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    delivery_id UUID REFERENCES public.deliveries(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('quality', 'quantity', 'late', 'billing', 'other')),
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(50) DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 10. COMPLAINT MESSAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaint_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('admin', 'client')),
    sender_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 11. APP SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'singleton',
    company_name VARCHAR(255) DEFAULT 'M/S Ali Food' NOT NULL,
    proprietor VARCHAR(255) DEFAULT 'AL ISLAM RIDHOY' NOT NULL,
    official_email VARCHAR(255) DEFAULT 'alifood3193@gmail.com' NOT NULL,
    primary_hotline VARCHAR(50) DEFAULT '01319-345501' NOT NULL,
    secondary_hotline VARCHAR(50) DEFAULT '01401-238019' NOT NULL,
    dhaka_address TEXT NOT NULL,
    chattogram_address TEXT NOT NULL,
    invoice_prefix VARCHAR(20) DEFAULT 'INV' NOT NULL,
    delivery_prefix VARCHAR(20) DEFAULT 'DL' NOT NULL,
    payment_prefix VARCHAR(20) DEFAULT 'PAY' NOT NULL,
    default_due_days INT DEFAULT 7 NOT NULL,
    bank_details TEXT,
    bkash_number VARCHAR(100),
    nagad_number VARCHAR(100),
    invoice_footer_text TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed app_settings if not exists
INSERT INTO public.app_settings (id, company_name, proprietor, official_email, primary_hotline, secondary_hotline, dhaka_address, chattogram_address, default_due_days, bank_details, bkash_number, nagad_number, invoice_footer_text)
VALUES (
    'singleton',
    'M/S Ali Food',
    'AL ISLAM RIDHOY',
    'alifood3193@gmail.com',
    '01319-345501',
    '01401-238019',
    '7/1 Jam Jam Market, 1 No Rail Gate, Tejgaon, Dhaka-1208',
    'Toiyobiya Garden (2nd Floor), 238 D.T. Road, West Madarbari, Chattogram',
    7,
    'Dutch-Bangla Bank PLC | A/C Name: M/S Ali Food | A/C No: 123.110.456789 | Branch: Tejgaon, Dhaka',
    '01319-345501 (Merchant / Agent)',
    '01401-238019 (Merchant)',
    'Terms: 100% Halal Manual Slaughter. Pre-dawn chilled delivery. Discrepancies must be reported within 24 hours.'
) ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 12. TRIGGERS & FUNCTIONS: Auto Numbering & Invoice Payment Recomputation
-- ------------------------------------------------------------------------------

-- Function: Recompute Invoice Paid Amount and Status upon Payment changes
CREATE OR REPLACE FUNCTION public.fn_sync_invoice_payment()
RETURNS TRIGGER AS $$
DECLARE
    target_invoice_id UUID;
    total_paid NUMERIC(12, 2);
    inv_total NUMERIC(12, 2);
    inv_due DATE;
    current_status VARCHAR(50);
BEGIN
    target_invoice_id := COALESCE(NEW.invoice_id, OLD.invoice_id);

    IF target_invoice_id IS NOT NULL THEN
        SELECT COALESCE(SUM(amount), 0) INTO total_paid
        FROM public.payments
        WHERE invoice_id = target_invoice_id AND deleted_at IS NULL;

        SELECT total, due_date, status INTO inv_total, inv_due, current_status
        FROM public.invoices
        WHERE id = target_invoice_id;

        IF current_status != 'void' AND current_status != 'draft' THEN
            IF total_paid >= inv_total AND inv_total > 0 THEN
                current_status := 'paid';
            ELSIF total_paid > 0 THEN
                current_status := 'partial';
            ELSE
                IF inv_due < CURRENT_DATE THEN
                    current_status := 'overdue';
                ELSE
                    current_status := 'issued';
                END IF;
            END IF;

            UPDATE public.invoices
            SET paid_amount = total_paid,
                status = current_status,
                updated_at = timezone('utc'::text, now())
            WHERE id = target_invoice_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_invoice_payment ON public.payments;
CREATE TRIGGER trg_sync_invoice_payment
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_invoice_payment();

-- ------------------------------------------------------------------------------
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Security-definer helper to check if authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Security-definer helper to get client_id of current authenticated user
CREATE OR REPLACE FUNCTION public.get_auth_client_id()
RETURNS UUID AS $$
DECLARE
    c_id UUID;
BEGIN
    SELECT client_id INTO c_id
    FROM public.profiles
    WHERE id = auth.uid();
    RETURN c_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 13.1 PROFILES POLICIES
DROP POLICY IF EXISTS "Admin Full Access Profiles" ON public.profiles;
CREATE POLICY "Admin Full Access Profiles" ON public.profiles
FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Client Read Own Profile" ON public.profiles;
CREATE POLICY "Client Read Own Profile" ON public.profiles
FOR SELECT TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "Client Update Own Profile" ON public.profiles;
CREATE POLICY "Client Update Own Profile" ON public.profiles
FOR UPDATE TO authenticated USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = 'client');

-- 13.2 CLIENTS POLICIES
DROP POLICY IF EXISTS "Admin Full Access Clients" ON public.clients;
CREATE POLICY "Admin Full Access Clients" ON public.clients
FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Client Read Own Client Record" ON public.clients;
CREATE POLICY "Client Read Own Client Record" ON public.clients
FOR SELECT TO authenticated USING (id = public.get_auth_client_id());

-- 13.3 PRODUCTS BILLING POLICIES
DROP POLICY IF EXISTS "Admin Full Access Products Billing" ON public.products_billing;
CREATE POLICY "Admin Full Access Products Billing" ON public.products_billing
FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Client Read Products Billing" ON public.products_billing;
CREATE POLICY "Client Read Products Billing" ON public.products_billing
FOR SELECT TO authenticated USING (active = true);

-- 13.4 DELIVERIES POLICIES
DROP POLICY IF EXISTS "Admin Full Access Deliveries" ON public.deliveries;
CREATE POLICY "Admin Full Access Deliveries" ON public.deliveries
FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Client Read Own Deliveries" ON public.deliveries;
CREATE POLICY "Client Read Own Deliveries" ON public.deliveries
FOR SELECT TO authenticated USING (client_id = public.get_auth_client_id() AND deleted_at IS NULL);

-- 13.5 DELIVERY ITEMS POLICIES
DROP POLICY IF EXISTS "Admin Full Access Delivery Items" ON public.delivery_items;
CREATE POLICY "Admin Full Access Delivery Items" ON public.delivery_items
FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Client Read Own Delivery Items" ON public.delivery_items;
CREATE POLICY "Client Read Own Delivery Items" ON public.delivery_items
FOR SELECT TO authenticated USING (
    delivery_id IN (
        SELECT id FROM public.deliveries WHERE client_id = public.get_auth_client_id() AND deleted_at IS NULL
    )
);

-- 13.6 INVOICES POLICIES
DROP POLICY IF EXISTS "Admin Full Access Invoices" ON public.invoices;
CREATE POLICY "Admin Full Access Invoices" ON public.invoices
FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Client Read Own Invoices" ON public.invoices;
CREATE POLICY "Client Read Own Invoices" ON public.invoices
FOR SELECT TO authenticated USING (
    client_id = public.get_auth_client_id() AND status != 'draft' AND deleted_at IS NULL
);

-- 13.7 INVOICE ITEMS POLICIES
DROP POLICY IF EXISTS "Admin Full Access Invoice Items" ON public.invoice_items;
CREATE POLICY "Admin Full Access Invoice Items" ON public.invoice_items
FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Client Read Own Invoice Items" ON public.invoice_items;
CREATE POLICY "Client Read Own Invoice Items" ON public.invoice_items
FOR SELECT TO authenticated USING (
    invoice_id IN (
        SELECT id FROM public.invoices WHERE client_id = public.get_auth_client_id() AND status != 'draft' AND deleted_at IS NULL
    )
);

-- 13.8 PAYMENTS POLICIES
DROP POLICY IF EXISTS "Admin Full Access Payments" ON public.payments;
CREATE POLICY "Admin Full Access Payments" ON public.payments
FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Client Read Own Payments" ON public.payments;
CREATE POLICY "Client Read Own Payments" ON public.payments
FOR SELECT TO authenticated USING (
    client_id = public.get_auth_client_id() AND deleted_at IS NULL
);

-- 13.9 COMPLAINTS POLICIES
DROP POLICY IF EXISTS "Admin Full Access Complaints" ON public.complaints;
CREATE POLICY "Admin Full Access Complaints" ON public.complaints
FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Client Read Own Complaints" ON public.complaints;
CREATE POLICY "Client Read Own Complaints" ON public.complaints
FOR SELECT TO authenticated USING (client_id = public.get_auth_client_id());

DROP POLICY IF EXISTS "Client Insert Own Complaints" ON public.complaints;
CREATE POLICY "Client Insert Own Complaints" ON public.complaints
FOR INSERT TO authenticated WITH CHECK (client_id = public.get_auth_client_id());

-- 13.10 COMPLAINT MESSAGES POLICIES
DROP POLICY IF EXISTS "Admin Full Access Complaint Messages" ON public.complaint_messages;
CREATE POLICY "Admin Full Access Complaint Messages" ON public.complaint_messages
FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Client Read Own Complaint Messages" ON public.complaint_messages;
CREATE POLICY "Client Read Own Complaint Messages" ON public.complaint_messages
FOR SELECT TO authenticated USING (
    complaint_id IN (SELECT id FROM public.complaints WHERE client_id = public.get_auth_client_id())
);

DROP POLICY IF EXISTS "Client Insert Own Complaint Messages" ON public.complaint_messages;
CREATE POLICY "Client Insert Own Complaint Messages" ON public.complaint_messages
FOR INSERT TO authenticated WITH CHECK (
    complaint_id IN (SELECT id FROM public.complaints WHERE client_id = public.get_auth_client_id())
    AND sender_role = 'client'
);

-- 13.11 APP SETTINGS POLICIES
DROP POLICY IF EXISTS "Admin Manage App Settings" ON public.app_settings;
CREATE POLICY "Admin Manage App Settings" ON public.app_settings
FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Public Read App Settings" ON public.app_settings;
CREATE POLICY "Public Read App Settings" ON public.app_settings
FOR SELECT USING (true);
