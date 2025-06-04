/*
  # Create products table and security policies

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `price` (numeric)
      - `stock` (integer)
      - `requiresSecondaryFabric` (boolean)
      - `compatibleFabrics` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on products table
    - Add policies for CRUD operations
    - Create trigger for updating timestamps

  3. Changes
    - Add indexes for performance
*/

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    category text NOT NULL,
    price numeric NOT NULL,
    stock integer NOT NULL DEFAULT 0,
    "requiresSecondaryFabric" boolean NOT NULL DEFAULT false,
    "compatibleFabrics" jsonb NOT NULL DEFAULT '{"primary": [], "secondary": []}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS Policies
CREATE POLICY "Allow authenticated users to read all products"
    ON public.products
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to create products"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their own products"
    ON public.products
    FOR UPDATE
    TO authenticated
    USING (auth.uid() IN (
        SELECT user_id
        FROM quotations
        WHERE items @> format('[{"product_id": "%s"}]', id)::jsonb
    ))
    WITH CHECK (auth.uid() IN (
        SELECT user_id
        FROM quotations
        WHERE items @> format('[{"product_id": "%s"}]', id)::jsonb
    ));

CREATE POLICY "Allow authenticated users to delete their own products"
    ON public.products
    FOR DELETE
    TO authenticated
    USING (auth.uid() IN (
        SELECT user_id
        FROM quotations
        WHERE items @> format('[{"product_id": "%s"}]', id)::jsonb
    ));

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);