import { createReducer, on } from '@ngrx/store';
import { Lyn } from 'src/app/models/lyn-event.model';
import { LoadingStatus } from 'src/app/models/status.model';
import { loadLightningMap, loadLightningMapSuccess, loadLightningMapFailed, recievedRealtimeLyn } from './ligthning.action';
import produce from "immer"

export const initialState: LigthningState = {
  lightningsHistory: [],
  lightnings: [],
  status: 'pending'
};

export interface LigthningState {
  lightningsHistory: Lyn[];
  lightnings: Lyn[];
  status: LoadingStatus
  error?: string;
}

export const counterReducer = createReducer(
  initialState,
  on(loadLightningMap, (state): LigthningState => produce(state, newState => {
    newState.status = 'pending';
  })),
  on(loadLightningMapSuccess, (state, {history}) => produce(state, newState => {
    newState.lightningsHistory = history;
  })),
  on(recievedRealtimeLyn, (state, {list}) => produce(state, newState => {
    newState.lightnings = list;
  })),
  on(loadLightningMapFailed, (state, {error}) => produce(state, newState => {
    newState.status = 'error';
    newState.error = error;
  }))
);
