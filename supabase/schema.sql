-- ==============================================================================
-- M/S ALI FOOD - B2B WHOLESALE & INSTITUTIONAL POULTRY PLATFORM
-- PRODUCTION POSTGRESQL SCHEMA (SUPABASE READY)
-- Record Reference: AF/CORP/2026 | Vendor Code: AF-INST-2026/09
-- ==============================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sl INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_slug VARCHAR(100) NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    description TEXT,
    processing_specification TEXT NOT NULL,
    supply_form VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'Kg',
    rate NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(20) DEFAULT 'BDT ৳',
    price_visible BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE,
    min_quantity NUMERIC(10, 2) DEFAULT 5,
    image_url TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_boneless BOOLEAN DEFAULT FALSE,
    has_skin BOOLEAN DEFAULT TRUE,
    is_specialty BOOLEAN DEFAULT FALSE,
    is_live BOOLEAN DEFAULT FALSE,
    temperature VARCHAR(50) DEFAULT 'Chilled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    customer_type VARCHAR(100) NOT NULL, -- Restaurant, Catering, Supermarket, Corporate Kitchen, etc.
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    delivery_city VARCHAR(100) DEFAULT 'Dhaka',
    delivery_area VARCHAR(255),
    delivery_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS TABLE (B2B Supply Requisitions)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. AF-2026-000123
    customer_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    customer_type VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    delivery_city VARCHAR(50) NOT NULL, -- Dhaka or Chattogram
    delivery_area VARCHAR(255) NOT NULL,
    delivery_address TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time_slot VARCHAR(100) NOT NULL,
    special_instructions TEXT,
    estimated_total NUMERIC(12, 2) DEFAULT 0,
    has_quote_items BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'New' NOT NULL, -- New, Confirmed, Processing, Ready, Dispatched, Delivered, Cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id VARCHAR(100),
    product_name VARCHAR(255) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    price_visible BOOLEAN DEFAULT TRUE,
    subtotal NUMERIC(12, 2) NOT NULL,
    custom_notes TEXT,
    specification TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. SUPPLY PARTNERS TABLE (Monochrome Social Proof - Zero Certificates)
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    tag VARCHAR(100),
    visible BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. CUSTOM CUT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.custom_cut_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    bird_type VARCHAR(100) NOT NULL,
    cut_specification TEXT NOT NULL,
    skin_preference VARCHAR(50) DEFAULT 'Skinless',
    bone_preference VARCHAR(50) DEFAULT 'Boneless',
    packaging_preference TEXT,
    estimated_volume_kg NUMERIC(10, 2) DEFAULT 20,
    frequency VARCHAR(50) DEFAULT 'Daily',
    delivery_city VARCHAR(50) DEFAULT 'Dhaka',
    delivery_address TEXT,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_cut_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public can read products, categories, partners, and active settings
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Active Products" ON public.products FOR SELECT USING (active = true);
CREATE POLICY "Public Read Visible Partners" ON public.partners FOR SELECT USING (visible = true);
CREATE POLICY "Public Read Settings" ON public.settings FOR SELECT USING (true);

-- Public can insert new orders, order items, and custom cut inquiries
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Custom Cuts" ON public.custom_cut_inquiries FOR INSERT WITH CHECK (true);

-- Staff / Authenticated users full access
CREATE POLICY "Authenticated Manage Products" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated Manage Orders" ON public.orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated Manage Order Items" ON public.order_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated Manage Partners" ON public.partners FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated Manage Settings" ON public.settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated Manage Inquiries" ON public.custom_cut_inquiries FOR ALL TO authenticated USING (true);

-- ==============================================================================
-- INITIAL SYSTEM SETTINGS SEED
-- ==============================================================================
INSERT INTO public.settings (key, value) VALUES
('company_config', '{
    "primaryHotline": "01319-345501",
    "secondaryHotline": "01401-238019",
    "officialEmail": "alifood3193@gmail.com",
    "adminNotificationEmail": "alifood3193@gmail.com",
    "announcementText": "Commercial pre-dawn delivery routes (5:00 AM–8:00 AM) active daily across Dhaka & Chattogram hubs.",
    "isAnnouncementActive": true
}'::JSONB)
ON CONFLICT (key) DO NOTHING;

-- Seed Documented Supply Partners (Strictly Sourced - No Certificates)
INSERT INTO public.partners (slug, name, category, location, description, tag, sort_order) VALUES
('shwapno', 'SHWAPNO', 'Supermarket & Retail Chain', 'Chattogram Regional Stores', 'Regular commercial supply of fresh and chilled chicken products to supermarket retail outlets.', 'Superstore Retail Chain', 1),
('aribahs-kitchen', 'Aribah''s Kitchen', 'Commercial Kitchen & Catering', '273/3 West Nakhalpara, Tejgaon, Dhaka', 'Direct poultry supply and customized dressed cuts for central kitchen and catering operations.', 'Central Kitchen & Catering', 2),
('charulota-restora', 'Charulota Restora', 'Multi-Cuisine Restaurant & Catering', 'Kawran Bazar / Tejgaon, Dhaka', 'Daily scheduled delivery of fresh dressed poultry and culinary cuts for 24-hour restaurant and event catering service.', 'Restaurant & Event Catering', 3),
('velisse', 'Velisse Multicuisine', 'Institutional Food Service', 'Dhaka Commercial Operations', 'Regular wholesale poultry cuts and portion-controlled supply for institutional kitchen menus.', 'Fine Dining & Food Service', 4)
ON CONFLICT (slug) DO NOTHING;
