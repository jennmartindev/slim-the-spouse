import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-add-meal',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './add-meal.component.html',
  styleUrl: './add-meal.component.scss',
})
export class AddMealComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly supabaseService = inject(SupabaseService);
  private router = inject(Router);

  form = this.formBuilder.group({
    name: '',
    calories: '',
    fiber: '',
    protein: ''
  });

  onBack = () => this.router.navigate(['manage-meals']);

  onSubmit() {
    const name = this.form.value.name as string;
    let calories = 0;
    let fiber = 0;
    let protein = 0;

    if (this.isNumeric(this.form.value.calories as string)) {
      calories = parseFloat(this.form.value.calories!);
    }

    if (this.isNumeric(this.form.value.fiber as string)) {
      fiber = parseFloat(this.form.value.fiber!);
    }

    if (this.isNumeric(this.form.value.protein as string)) {
      protein = parseFloat(this.form.value.protein!);
    }

    if (name !== '' && calories > 0) {
      const data = { name, calories, fiber, protein };
      this.supabaseService.insertData('spouse_meal', data);
    }
  }

  private isNumeric(str: string): boolean {
    const num = parseFloat(str);
    return !isNaN(num) && isFinite(num);
  }
}
