import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { MealListItem } from '../models/meal-list-item';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-meal-form',
  imports: [CommonModule, DecimalPipe, MatButtonModule, MatDividerModule, MatIconModule, MatInputModule, MatListModule],
  templateUrl: './meal-form.component.html',
  styleUrl: './meal-form.component.scss',
})
export class MealFormComponent implements OnInit {
  private readonly supabaseService = inject(SupabaseService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  mealList: any;
  calorieList: any;
  date = this.activatedRoute.snapshot.params['date'];

  ngOnInit() {
    this.supabaseService.getMealList().then(ml => (this.mealList = ml));
  }

  onAddQuantity(item: MealListItem) {
    const index = this.mealList.findIndex((mealListItem: MealListItem) => mealListItem.id === item.id);

    if (index !== -1) {
      this.mealList[index].quantity =
        this.mealList[index].quantity === undefined
          ? 1
          : this.mealList[index].quantity === 0.5
            ? 1
            : this.mealList[index].quantity + 1;
    }

    this.calorieList = this.mealList.filter((f: MealListItem) => f.quantity > 0);
  }

  onRemoveQuantity(item: MealListItem) {
    const index = this.mealList.findIndex((mealListItem: MealListItem) => mealListItem.id === item.id);

    if (index !== -1) {
      this.mealList[index].quantity =
        this.mealList[index].quantity === undefined ||
        this.mealList[index].quantity === 0 ||
        this.mealList[index].quantity === 0.5
          ? 0
          : this.mealList[index].quantity === undefined || this.mealList[index].quantity === 1
            ? 0.5
            : this.mealList[index].quantity - 1;
    }

    this.calorieList = this.mealList.filter((f: MealListItem) => f.quantity > 0);
  }

  getTotal() {
    return this.calorieList.reduce(
      (sum: number, calorie: MealListItem) => sum + calorie.calories * calorie.quantity,
      0
    );
  }

  onBack = () => this.router.navigate(['']);

  onSubmit() {
    let data: any = [];

    this.calorieList.forEach((item: MealListItem) => {
      data.push({
        date: this.date,
        meal_id: item.id,
        quantity: item.quantity,
        calories: item.calories * item.quantity,
        fiber: item.fiber * item.quantity,
        protein: item.protein * item.quantity
      });
    });

    this.supabaseService.insertData('spouse_daily_diary', data);
  }
}
