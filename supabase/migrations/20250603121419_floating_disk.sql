/*
  # Create quotations table

  1. New Tables
    - `quotations`
      - `id` (uuid, primary key)
      - `number` (text, unique)
      - `date` (timestamptz)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `customer_address` (text)
      - `items` (jsonb)
      - `subtotal` (numeric)
      - `tax` (numeric)
      - `total` (numeric)
      - `status` (text)
      - `valid_until` (timestamptz)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text UNIQUE NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  customer_address text,
  items jsonb NOT NULL,
  subtotal numeric NOT NULL,
  tax numeric NOT NULL,
  total numeric NOT NULL,
  status text NOT NULL DEFAULT 'Draft',
  valid_until timestamptz NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own quotations"
  ON quotations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own quotations"
  ON quotations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotations"
  ON quotations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotations"
  ON quotations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);