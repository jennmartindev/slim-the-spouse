import { createFeatureSelector, createSelector } from '@ngrx/store';
import { appFeatureKey, AppState } from './app.reducer';

export const selectAppFeature = createFeatureSelector<AppState>(appFeatureKey);

export const selectDate = createSelector(selectAppFeature, (state: AppState) => state.date);
