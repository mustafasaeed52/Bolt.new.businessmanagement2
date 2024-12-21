/*
  # Initial Schema Setup for Business Management System

  1. New Tables
    - users (managed by Supabase Auth)
    - products
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - sku (text, unique)
      - price (numeric)
      - quantity (integer)
      - category (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    - orders
      - id (uuid, primary key)
      - customer_id (uuid, references auth.users)
      - total (numeric)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    - order_items
      - id (uuid, primary key)
      - order_id (uuid, references orders)
      - product_id (uuid, references products)
      - quantity (integer)
      - price (numeric)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Products Table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  sku text UNIQUE NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  quantity integer NOT NULL DEFAULT 0,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders Table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES auth.users NOT NULL,
  total numeric NOT NULL CHECK (total >= 0),
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items Table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can read products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their own orders"
  ON orders FOR ALL
  TO authenticated
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Authenticated users can manage order items"
  ON order_items FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.customer_id = auth.uid()
  ));