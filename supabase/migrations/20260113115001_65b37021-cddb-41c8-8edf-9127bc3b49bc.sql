-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: product_variants
-- Purpose: Store different variants of beetroot powder
-- =====================================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_name VARCHAR(100) NOT NULL,
    description TEXT,
    weight_size VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10, 2) CHECK (original_price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    badge TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for active variants query
CREATE INDEX idx_variants_active ON product_variants(is_active, display_order);

-- =====================================================
-- TABLE: orders
-- Purpose: Store customer orders
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    delivery_address TEXT NOT NULL,
    product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    order_status VARCHAR(50) DEFAULT 'Pending' CHECK (
        order_status IN ('Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled')
    ),
    payment_method VARCHAR(50) DEFAULT 'COD',
    notes TEXT,
    customer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for efficient querying
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_phone ON orders(phone_number);
CREATE INDEX idx_orders_customer_name ON orders(customer_name);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- =====================================================
-- TABLE: order_status_history
-- Purpose: Track order status changes for auditing
-- =====================================================
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    notes TEXT
);

-- Index for order history lookup
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id, changed_at DESC);

-- =====================================================
-- TABLE: site_settings
-- Purpose: Store global site configuration
-- =====================================================
CREATE TABLE site_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'text',
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: customer_testimonials
-- Purpose: Store customer testimonials for landing page
-- =====================================================
CREATE TABLE customer_testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(100) NOT NULL,
    customer_location VARCHAR(100),
    testimonial_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    customer_photo_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for active testimonials
CREATE INDEX idx_testimonials_active ON customer_testimonials(is_active, display_order);

-- =====================================================
-- TABLE: user_roles (for admin role management)
-- Purpose: Store user roles to manage admin access
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, role)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);

-- =====================================================
-- FUNCTION: Generate unique order number
-- =====================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_order_number TEXT;
    number_exists BOOLEAN;
BEGIN
    LOOP
        new_order_number := 'BO-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
            LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_order_number) INTO number_exists;
        EXIT WHEN NOT number_exists;
    END LOOP;
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Update timestamp on record update
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Check if user has role (security definer)
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role = _role
    )
$$;

-- =====================================================
-- TRIGGERS: Auto-update updated_at timestamps
-- =====================================================
CREATE TRIGGER update_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON customer_testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER: Auto-generate Order Number
-- =====================================================
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- =====================================================
-- TRIGGER: Track Order Status Changes
-- =====================================================
CREATE OR REPLACE FUNCTION track_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.order_status IS DISTINCT FROM NEW.order_status THEN
        INSERT INTO order_status_history (order_id, old_status, new_status, notes)
        VALUES (NEW.id, OLD.order_status, NEW.order_status, 'Status updated');

        IF NEW.order_status = 'Delivered' AND OLD.order_status != 'Delivered' THEN
            NEW.delivered_at = NOW();
        END IF;

        IF NEW.order_status = 'Cancelled' AND OLD.order_status != 'Cancelled' THEN
            NEW.cancelled_at = NOW();
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_order_status_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION track_order_status_change();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Public read access for active product variants (for landing page)
CREATE POLICY "Anyone can view active product variants"
    ON product_variants FOR SELECT
    USING (is_active = true);

-- Public read access for active testimonials
CREATE POLICY "Anyone can view active testimonials"
    ON customer_testimonials FOR SELECT
    USING (is_active = true);

-- Public insert access for orders (customer can place order)
CREATE POLICY "Anyone can create orders"
    ON orders FOR INSERT
    WITH CHECK (true);

-- Admin full access policies using has_role function
CREATE POLICY "Admins have full access to product_variants"
    ON product_variants FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins have full access to orders"
    ON orders FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins have full access to order_status_history"
    ON order_status_history FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins have full access to site_settings"
    ON site_settings FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins have full access to testimonials"
    ON customer_testimonials FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
    ON user_roles FOR SELECT
    USING (auth.uid() = user_id);

-- Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
    ON user_roles FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- INITIAL DATA: Sample product variants
-- =====================================================
INSERT INTO product_variants (variant_name, description, weight_size, price, original_price, stock_quantity, is_active, display_order, badge)
VALUES 
    ('Beetroot Powder - Trial', '100% অর্গানিক বিটরুট পাউডার - ট্রায়াল প্যাক', '100g', 499.00, 599.00, 50, true, 1, NULL),
    ('Beetroot Powder - Regular', '100% অর্গানিক বিটরুট পাউডার - নিয়মিত ব্যবহারের জন্য', '250g', 999.00, 1200.00, 100, true, 2, 'Most Popular'),
    ('Beetroot Powder - Value Pack', '100% অর্গানিক বিটরুট পাউডার - সবচেয়ে সাশ্রয়ী', '500g', 1499.00, 1800.00, 75, true, 3, 'Best Value');

-- Insert initial site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
VALUES 
    ('site_name', 'Organic Beetroot Powder', 'text', 'Site name displayed on landing page'),
    ('contact_phone', '+880-1XXX-XXXXXX', 'text', 'Customer support phone number'),
    ('contact_email', 'support@beetroot.com', 'text', 'Customer support email'),
    ('free_delivery_threshold', '1500', 'number', 'Minimum order amount for free delivery'),
    ('low_stock_threshold', '10', 'number', 'Alert when stock falls below this number'),
    ('enable_countdown_timer', 'true', 'boolean', 'Show countdown timer on landing page'),
    ('limited_stock_message', 'মাত্র ৫০টি প্যাকেজ বাকি', 'text', 'Stock scarcity message');