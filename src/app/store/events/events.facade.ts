import { EventsActions } from './events.actions';
import { IEventsState } from '../../models/events.models'
import { eventsFeature } from './events.feature';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class EventsFacade {
  events$ = this.store.select(eventsFeature.selectEvents)

  constructor(private store: Store<IEventsState>) {}

  fetchCustomerEvents() {
    this.store.dispatch(EventsActions.events_request())
  }

}
