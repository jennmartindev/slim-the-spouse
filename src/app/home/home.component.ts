import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DailyDiaryComponent } from '../daily-diary/daily-diary.component';
import { setSelectedDate } from '../store/app.actions';
import { selectDate } from '../store/app.selectors';

@Component({
  selector: 'app-home',
  imports: [CommonModule, DailyDiaryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private store = inject(Store);
  day$ = this.store.select(selectDate);

  setDate = (e: string) => this.store.dispatch(setSelectedDate({ date: e }));
}
