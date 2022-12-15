import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators'
import { EventsActions } from './events.actions';
import { of } from 'rxjs';
import { Action } from '@ngrx/store';
import { OnInitEffects } from '@ngrx/effects';
import { EventsService } from 'src/app/services/events.service';
import { IEventsResponse } from 'src/app/models/events.models';
@Injectable()
export class BlogEffects implements OnInitEffects {

  // MODULE INIT EFFECTS
  ngrxOnInitEffects(): Action {
    return EventsActions.events_module_init();
  }

  eventsFeatureInitialFetchEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.events_module_init),
      map(() => EventsActions.events_request())
    )
  );

  // REGULAR EFFECTS
  fetchEventsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.events_request),
      mergeMap(() => this.eventsService.getEvents()
        .pipe(
          map((res: IEventsResponse) => EventsActions.events_response(
            res.events
          )),
          catchError((error) => of(EventsActions.events_failure(error)))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private eventsService: EventsService,
  ) {}
}
