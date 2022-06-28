import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Lyn } from 'src/app/models/lyn-event.model';

export const selectRealtimeLigthnings = createFeatureSelector<ReadonlyArray<Lyn>>('lightnings');
export const selectHistoryLigthnings = createFeatureSelector<ReadonlyArray<Lyn>>('lightningsHistory');
export const selectStatus = createFeatureSelector<string>('status');
export const selectErrorMessage = createFeatureSelector<string | undefined>('error');
/*
export const selectCollectionState = createFeatureSelector<
  ReadonlyArray<string>
>('collection'); */

/* export const selectBookCollection = createSelector(
  selectBooks,
  selectCollectionState,
  (books, collection) => {
    return collection.map((id) => books.find((book) => book.id === id));
  }
); */
