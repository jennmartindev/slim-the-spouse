import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthChangeEvent, AuthSession, createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { MealListItem } from '../models/meal-list-item';

export interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private router = inject(Router);
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  profile(user: User) {
    return this.supabase.from('profiles').select(`username, website, avatar_url`).eq('id', user.id).single();
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  async insertData(table: string, data: any) {
    const { error } = await this.supabase.from(table).insert(data);
    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log(data);
      this.router.navigate(['']);
    }
  }

  async deleteMeal(id: number) {
    const { error } = await this.supabase.from('spouse_meal').update({ is_deleted: true }).eq('id', id);
    if (error) {
      console.error('Error deleting meal:', error);
    } else {
      console.log('success');
    }
  }

  async updateDailyFoodItem(item: any) {
    const { error } = await this.supabase
      .from('spouse_daily_diary')
      .update({ calories: item.calories, quantity: item.quantity, fiber: item.fiber, protein: item.protein })
      .eq('id', item.id);
    if (error) {
      console.error('Error updating daily food item:', error);
    } else {
      console.log('success');
    }
  }

  async getCaloriesConsumedByDay(day: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('spouse_daily_diary')
      .select('date, caloriesConsumed: calories.sum()')
      .eq('date', day);

    if (error) {
      console.error('Error fetching sum:', error);
      return 0;
    } else {
      return data.length === 0 ? 0 : data[0].caloriesConsumed;
    }
  }

  async getFiberConsumedByDay(day: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('spouse_daily_diary')
      .select('date, fiberConsumed: fiber.sum()')
      .eq('date', day);

    if (error) {
      console.error('Error fetching sum:', error);
      return 0;
    } else {
      return data.length === 0 ? 0 : data[0].fiberConsumed;
    }
  }

  async getProteinConsumedByDay(day: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('spouse_daily_diary')
      .select('date, proteinConsumed: protein.sum()')
      .eq('date', day);

    if (error) {
      console.error('Error fetching sum:', error);
      return 0;
    } else {
      return data.length === 0 ? 0 : data[0].proteinConsumed;
    }
  }

  async getDiaryByDay(day: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('spouse_daily_diary')
      .select('*, meal:spouse_meal(id, name, calories, fiber, protein)')
      .eq('date', day)
      .order('meal(name)', { ascending: true });

    if (error) {
      console.error('Error getting all:', error);
      return null;
    } else {
      return data;
    }
  }

  async getMealList(): Promise<MealListItem[]> {
    const { data, error } = await this.supabase
      .from('spouse_meal')
      .select('*')
      .eq('is_deleted', false)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error getting meal list:', error);
      return [];
    } else {
      return data;
    }
  }
}
