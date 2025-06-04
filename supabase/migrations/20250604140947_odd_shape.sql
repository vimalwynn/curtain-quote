/*
  # Create Products Table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `price` (numeric)
      - `stock` (integer)
      - `requiresSecondaryFabric` (boolean)
      - `compatibleFabrics` (jsonb)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `products` table
    - Add policies for authenticated users to:
      - Read all products
      - Create products
      - Update their own products
      - Delete their own products

  3. Triggers
    - Add trigger to automatically update `updated_at` timestamp
*/

-- Create products table
CREATE TABLE public.products (
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

-- Create policies
CREATE POLICY "Allow users to view all products"
    ON public.products
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow users to create products"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow users to update their own products"
    ON public.products
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Allow users to delete their own products"
    ON public.products
    FOR DELETE
    TO authenticated
    USING (auth.uid() = created_by);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add created_by column for ownership
ALTER TABLE public.products
ADD COLUMN created_by uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add index for faster lookups
CREATE INDEX products_category_idx ON public.products(category);
CREATE INDEX products_created_by_idx ON public.products(created_by);