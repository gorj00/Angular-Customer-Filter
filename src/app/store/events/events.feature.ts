import { EventsActions } from './events.actions';
import { createFeature, createReducer, on } from '@ngrx/store';
import { IEventsState } from 'src/app/models/events.models';

const initialState: IEventsState = {
  events: null,
  loading: false,
  error: null,
};

export const eventsFeature = createFeature({
  name: 'events',
  reducer: createReducer(
    initialState,
    on(EventsActions.events_request, (state: IEventsState) => ({
      ...state,
      loading: true,
    })),
    on(EventsActions.events_response, (state: IEventsState, { events }) => ({
      ...state,
      events,
      loading: false,
    })),
    on(EventsActions.events_failure, (state: IEventsState, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});

export const {
  name,
  reducer,
  selectEventsState,

  // + AUTO GENERATED SELECTORS
  } = eventsFeature
