import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Quotation {
  id: string;
  number: string;
  date: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  valid_until: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export async function saveQuotation(quotationData: Omit<Quotation, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
  const { data, error } = await supabase
    .from('quotations')
    .insert([quotationData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getQuotations() {
  const { data, error } = await supabase
    .from('quotations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getQuotationById(id: string) {
  const { data, error } = await supabase
    .from('quotations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateQuotation(id: string, updates: Partial<Quotation>) {
  const { data, error } = await supabase
    .from('quotations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteQuotation(id: string) {
  const { error } = await supabase
    .from('quotations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}