import { createReducer, on } from '@ngrx/store';
import moment from 'moment';
import * as appActions from './app.actions';

export const appFeatureKey = 'app';

export interface AppState {
  date: string;
}

export const initialState: AppState = {
  date: moment().format('YYYY-MM-DD'),
};

export const appReducer = createReducer(
  initialState,
  on(appActions.setSelectedDate, (state, { date }) => ({ ...state, date }))
);
