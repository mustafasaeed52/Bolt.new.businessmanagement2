import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env['SUPABASE_URL'] || '',
      process.env['SUPABASE_KEY'] || ''
    );
  }

  async createOrder(order: Omit<Order, 'id'>): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .insert(order)
      .single();
    if (error) throw error;
    return data;
  }

  async getOrders(): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*');
    if (error) throw error;
    return data;
  }
}