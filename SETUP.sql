-- CusAura Database Setup - SIMPLIFIED FOR SUPABASE

-- ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_active ON admin_users(is_active);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  color VARCHAR(100),
  category VARCHAR(100),
  description TEXT,
  image_url VARCHAR(500),
  image_path VARCHAR(500),
  image_size_bytes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  shipping_name VARCHAR(255),
  shipping_email VARCHAR(255),
  shipping_phone VARCHAR(20),
  shipping_address VARCHAR(500),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  product_color VARCHAR(100),
  product_category VARCHAR(100),
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  customization JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- STORAGE METADATA TABLE
CREATE TABLE IF NOT EXISTS storage_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  file_type VARCHAR(50),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE,
  access_count INTEGER DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_storage_file_path ON storage_metadata(bucket_name, file_path);
CREATE INDEX IF NOT EXISTS idx_storage_product_id ON storage_metadata(product_id);
CREATE INDEX IF NOT EXISTS idx_storage_size ON storage_metadata(file_size_bytes);

-- SAMPLE PRODUCTS DATA
INSERT INTO products (name, price, color, category, description, is_active)
VALUES 
  ('Noir Derby', 14999, 'Black', 'Derby', 'Handcrafted from the finest Italian calfskin leather. The Noir Derby features a classic cap-toe design with Goodyear welt construction for unmatched durability and elegance.', TRUE),
  ('Cognac Brogue', 18999, 'Cognac', 'Brogue', 'A masterpiece of traditional British shoemaking. Full brogue wingtip detailing on rich cognac leather, hand-burnished for a museum-quality finish.', TRUE),
  ('Oxblood Monk', 21999, 'Burgundy', 'Monk Strap', 'Double monk strap in deep oxblood burgundy. Hand-polished brass buckles and a sleek silhouette make this a boardroom essential.', TRUE),
  ('Chelsea Bordeaux', 16999, 'Brown', 'Chelsea Boot', 'The ultimate statement boot. Premium pull-up leather in dark bordeaux with elastic side panels and a refined slim profile.', TRUE),
  ('Midnight Loafer', 13999, 'Navy', 'Loafer', 'Effortless Italian sophistication. Deep midnight leather penny loafer with hand-stitched apron and butter-soft calfskin lining.', TRUE),
  ('Sahara Chukka', 15999, 'Tan', 'Chukka Boot', 'Desert-inspired elegance in premium suede. The Sahara Chukka features a two-eyelet design, leather sole, and a silhouette that bridges casual and formal.', TRUE)
ON CONFLICT DO NOTHING;

-- ADMIN USER (default)
-- Email: admin
-- Password: admin
INSERT INTO admin_users (email, password_hash, full_name, is_active)
VALUES (
  'admin',
  'YWRtaW4=', -- base64 encoded 'admin'
  'Admin User',
  TRUE
)
ON CONFLICT (email) DO NOTHING;
