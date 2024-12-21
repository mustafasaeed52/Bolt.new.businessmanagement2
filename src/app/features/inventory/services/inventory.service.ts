import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env['SUPABASE_URL'] || '',
      process.env['SUPABASE_KEY'] || ''
    );
  }

  async getProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*');
    if (error) throw error;
    return data;
  }

  async updateProduct(product: Product): Promise<Product> {
    const { data, error } = await this.supabase
      .from('products')
      .update(product)
      .eq('id', product.id)
      .single();
    if (error) throw error;
    return data;
  }
}