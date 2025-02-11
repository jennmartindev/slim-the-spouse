import { createAction, props } from '@ngrx/store';

export const setSelectedDate = createAction('[App] Set Selected Date', props<{ date: string }>());
