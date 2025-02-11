import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-manage-meals',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './manage-meals.component.html',
  styleUrl: './manage-meals.component.scss',
})
export class ManageMealsComponent {
  private router = inject(Router);
  private supabaseService = inject(SupabaseService);
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  mealList: any;

  ngOnInit() {
    this.getData();
  }

  add = () => this.router.navigate(['add-meal']);

  delete = (id: number) => {
    this.supabaseService.deleteMeal(id).then(() => this.getData());
  };

  private getData() {
    this.supabaseService.getMealList().then(ml => (this.mealList = ml));
  }

  swipe(e: TouchEvent, when: string, what: any): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord![0], coord[1] - this.swipeCoord![1]];
      const duration = time - this.swipeTime!;

      if (
        duration < 1000 && //
        Math.abs(direction[0]) > 30 && // Long enough
        Math.abs(direction[0]) > Math.abs(direction[1] * 3)
      ) {
        // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        // Do whatever you want with swipe

        if (direction[0] < 0) {
          what.showBtns = true;
        } else {
          what.showBtns = false;
        }
      }
    }
  }
}
