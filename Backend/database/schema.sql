-- ====================================================================
-- PURE GOLD Products — Ceylon Cinnamon E-Commerce
-- Database Tables Schema & Initial Data Inputs (SQL / Relational)
-- Compatible with PostgreSQL / MySQL / SQLite
-- ====================================================================

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    product_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(120) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id VARCHAR(50) NOT NULL REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    image TEXT NOT NULL,
    images JSON, -- JSON array of image URLs
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    weight VARCHAR(50) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    ingredients TEXT NOT NULL,
    processing VARCHAR(100) NOT NULL,
    shipping TEXT NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    stock INT DEFAULT 0 NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE NOT NULL,
    badge VARCHAR(50),
    featured BOOLEAN DEFAULT FALSE,
    tags JSON, -- JSON array of tag strings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. USERS TABLE (Customers)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    country VARCHAR(100) DEFAULT 'Sri Lanka',
    addresses JSON, -- Array of saved delivery addresses
    cart JSON, -- Active shopping cart items
    wishlist JSON, -- Array of wishlisted product IDs
    role VARCHAR(30) DEFAULT 'customer',
    status VARCHAR(30) DEFAULT 'active', -- 'active', 'inactive', 'blocked'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. STAFF TABLE (Administrators & Managers)
CREATE TABLE IF NOT EXISTS staff (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    username VARCHAR(60) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'superadmin', 'product_manager', 'order_manager', 'customer_support'
    permissions JSON, -- Array of permission strings ['all', 'products', 'orders', etc.]
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(50) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(30),
    items JSON NOT NULL, -- Array of ordered line items
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    applied_coupon VARCHAR(50),
    shipping_fee DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL,
    shipping_address JSON NOT NULL, -- Full delivery address object
    payment_method VARCHAR(50) DEFAULT 'cod', -- 'cod', 'bank_transfer', 'payhere', 'card'
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    order_status VARCHAR(50) DEFAULT 'processing', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
    product_name VARCHAR(200) NOT NULL,
    user_id VARCHAR(50) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    author VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    date DATE NOT NULL,
    title VARCHAR(200) NOT NULL,
    comment TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'approved', -- 'pending', 'approved', 'rejected'
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(30) NOT NULL, -- 'percentage', 'fixed'
    value DECIMAL(10, 2) NOT NULL,
    min_order DECIMAL(10, 2) DEFAULT 0.00,
    max_discount DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. DELIVERY ZONES TABLE
CREATE TABLE IF NOT EXISTS delivery_zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    base_rate DECIMAL(10, 2) NOT NULL,
    free_shipping_threshold DECIMAL(10, 2),
    estimated_days VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. CONTACTS TABLE (Customer Inquiries)
CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    subject VARCHAR(200) DEFAULT 'Website Inquiry',
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'new', -- 'new', 'replied', 'archived'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. NOTIFICATIONS TABLE (Admin Alerts)
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'order', -- 'order', 'user', 'review', 'stock', 'system'
    reference_id VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'store_config',
    store_name VARCHAR(150) NOT NULL,
    store_tagline TEXT,
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    currency_symbol VARCHAR(10) DEFAULT '$',
    free_shipping_threshold DECIMAL(10, 2) DEFAULT 50.00,
    flat_shipping_rate DECIMAL(10, 2) DEFAULT 5.00,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
