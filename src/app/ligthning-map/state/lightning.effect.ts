import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { LynMetService } from 'src/app/services/lyn-met.service';
import { loadLightningMap, loadLightningMapFailed, loadLightningMapSuccess } from './ligthning.action';

@Injectable()
export class LightningEffects {

  loadLightnings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadLightningMap),
      mergeMap(() => this.lynMetService.getLynHistory(10)
        .pipe(
          map(history => loadLightningMapSuccess({history})),
          catchError((error) => of(loadLightningMapFailed({error})))
        ))
    )
  }
  );

  constructor(
    private actions$: Actions,
    private lynMetService: LynMetService
  ) {}
}
