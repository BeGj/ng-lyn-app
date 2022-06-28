import { createAction, props } from '@ngrx/store';
import { Lyn } from 'src/app/models/lyn-event.model';

export const loadLightningMap = createAction('[LigthningMap Component] Load data');
export const loadLightningMapSuccess = createAction('[LigthningMap Component] Load data success', props<{history: Lyn[]}>());
export const recievedRealtimeLyn = createAction('[LigthningMap Component] Recieved realtime lyn', props<{list: Lyn[]}>());
export const loadLightningMapFailed = createAction('[LigthningMap Component] Load data failed', props<{error: string}>());
