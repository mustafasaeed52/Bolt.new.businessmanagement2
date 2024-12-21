import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    
    // Check for existing session
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        this.currentUserSubject.next({
          id: session.user.id,
          email: session.user.email!,
          firstName: '',
          lastName: '',
          role: 'employee',
          createdAt: new Date(session.user.created_at)
        });
      }
    });
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    
    if (data.user) {
      this.currentUserSubject.next({
        id: data.user.id,
        email: data.user.email!,
        firstName: '',
        lastName: '',
        role: 'employee',
        createdAt: new Date(data.user.created_at)
      });
    }
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
}