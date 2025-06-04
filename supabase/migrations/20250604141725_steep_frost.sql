/*
  # Add settings defaults

  1. New Tables
    - `settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `settings` table
    - Add policies for authenticated users to read/write settings

  3. Default Values
    - Add default settings for timezone, date format, currency, etc.
*/

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS Policies
CREATE POLICY "Allow authenticated users to read settings"
    ON public.settings
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to update settings"
    ON public.settings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES
    ('timezone', '"Asia/Bahrain"'),
    ('dateFormat', '"DD/MM/YYYY"'),
    ('currency', '"BHD"'),
    ('language', '"en"'),
    ('measurementUnit', '"metric"'),
    ('taxRate', '0.10'),
    ('quoteValidity', '30'),
    ('bulkDiscounts', '"basic"'),
    ('sessionTimeout', '"30"'),
    ('loginAttempts', '"5"'),
    ('autoBackup', '"disabled"'),
    ('backupRetention', '"10"'),
    ('notifications', '{"email": true, "push": false, "sms": false, "weeklyReport": true, "newQuotes": true, "quoteUpdates": true, "systemUpdates": true}')
ON CONFLICT (key) DO NOTHING;