import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import moment from 'moment';
import { BaseChartDirective } from 'ng2-charts';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-daily-diary',
  imports: [BaseChartDirective, CommonModule, DatePipe, DecimalPipe, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './daily-diary.component.html',
  styleUrl: './daily-diary.component.scss',
})
export class DailyDiaryComponent {
  day: string = '';
  @Input() set date(value: string | null) {
    if (value !== null) {
      this.day = value;
      this.getData();
    }
  }
  @Output() setDay = new EventEmitter<string>();
  private router = inject(Router);
  private supbaseService = inject(SupabaseService);
  private swipeCoord?: [number, number];
  private swipeTime?: number;

  diaryData: any;
  dateFormat: string = 'YYYY-MM-DD';
  calorieGoal: number = 1800;
  calorieConsumed: number = 0;
  calorieChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [];
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    events: [], // Disable all events
    plugins: {
      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
    cutout: '70%',
    circumference: 360,
    rotation: 360,
    responsive: true,
    maintainAspectRatio: true,
  };
  
  fiberGoal: number = 30;
  fiberConsumed: number = 0;
  fiberChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [];

  proteinGoal: number = 100;
  proteinConsumed: number = 0;
  proteinChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [];

  goBackDay() {
    this.setDay.emit(moment(this.day, this.dateFormat).add(-1, 'day').format(this.dateFormat));
  }

  goNextDay() {
    this.setDay.emit(moment(this.day, this.dateFormat).add(1, 'day').format(this.dateFormat));
  }

  add() {
    this.router.navigate(['add-calories', this.day]);
  }

  getData() {
    this.supbaseService.getCaloriesConsumedByDay(this.day).then(calories => {
      if (calories !== null) {
        this.calorieConsumed = calories;
        const calorieRemaining = this.calorieGoal - this.calorieConsumed;
        this.calorieChartDatasets = [
          {
            data: [this.calorieConsumed, calorieRemaining],
            backgroundColor: ['#552739', '#d9d9d9'],
          },
        ];
      }
    });

    this.supbaseService.getFiberConsumedByDay(this.day).then(fiber => {
      if (fiber !== null) {
        this.fiberConsumed = fiber;
        const fiberRemaining = this.fiberGoal - this.fiberConsumed;
        this.fiberChartDatasets = [
          {
            data: [this.fiberConsumed, fiberRemaining],
            backgroundColor: ['#a03b00', '#d9d9d9'],
          },
        ];
      }
    });

    this.supbaseService.getProteinConsumedByDay(this.day).then(protein => {
      if (protein !== null) {
        this.proteinConsumed = protein;
        const proteinRemaining = this.proteinGoal - this.proteinConsumed;
        this.proteinChartDatasets = [
          {
            data: [this.proteinConsumed, proteinRemaining],
            backgroundColor: ['#004b00', '#d9d9d9'],
          },
        ];
      }
    });

    this.supbaseService.getDiaryByDay(this.day).then(dayDiary => {
      this.diaryData = dayDiary;
    });
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

  onAddQuantity(item: any) {
    item.quantity = item.quantity === 0.5 ? 1 : item.quantity + 1;
    item.calories = item.quantity * item.meal.calories;
    item.fiber = item.quantity * item.meal.fiber;
    item.protein = item.quantity * item.meal.protein
    this.supbaseService.updateDailyFoodItem(item).then(() => this.getData());
  }

  onRemoveQuantity(item: any) {
    item.quantity = item.quantity === 1 ? 0.5 : item.quanitty === 0.5 ? 0 : item.quantity - 1;
    item.calories = item.quantity * item.meal.calories;
    item.fiber = item.quantity * item.meal.fiber;
    item.protein = item.quantity * item.meal.protein
    this.supbaseService.updateDailyFoodItem(item).then(() => this.getData());
  }
}
