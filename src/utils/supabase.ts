import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  requiresSecondaryFabric: boolean;
  compatibleFabrics: {
    primary: string[];
    secondary: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface QuotationUsage {
  id: string;
  quotation_number: string;
  customer_name: string;
  date: string;
  quantity: number;
  status: string;
  product_id: string;
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProductQuotations(productId: string) {
  const { data, error } = await supabase
    .from('quotations')
    .select(`
      id,
      number as quotation_number,
      customer_name,
      date,
      items,
      status
    `)
    .eq('status', 'active')
    .contains('items', [{ product_id: productId }])
    .order('date', { ascending: false })
    .limit(5);

  if (error) throw error;

  return data.map(quotation => ({
    id: quotation.id,
    quotation_number: quotation.quotation_number,
    customer_name: quotation.customer_name,
    date: quotation.date,
    quantity: quotation.items.find((item: any) => item.product_id === productId)?.quantity || 0,
    status: quotation.status
  }));
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}