import { Routes } from '@angular/router';
import { AddMealComponent } from './add-meal/add-meal.component';
import { HomeComponent } from './home/home.component';
import { ManageMealsComponent } from './manage-meals/manage-meals.component';
import { MealFormComponent } from './meal-form/meal-form.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'add-calories/:date',
    component: MealFormComponent,
  },
  {
    path: 'manage-meals',
    component: ManageMealsComponent,
  },
  {
    path: 'add-meal',
    component: AddMealComponent,
  },
];
