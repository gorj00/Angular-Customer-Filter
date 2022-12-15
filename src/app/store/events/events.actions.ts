import { IEventsResponse, IEvent } from 'src/app/models/events.models';
import { createActionGroup, emptyProps } from '@ngrx/store';

enum actionTypes {
  EVENTS_MODULE_INIT = 'EVENTS_MODULE_INIT',

  EVENTS_REQUEST = 'EVENTS_REQUEST',
  EVENTS_RESPONSE = 'EVENTS_RESPONSE',
  EVENTS_FAILURE = 'EVENTS_FAILURE',
}

export const EventsActions = createActionGroup({
  source: 'EVENTS',
  events: {
    [actionTypes.EVENTS_MODULE_INIT]: emptyProps(),

    [actionTypes.EVENTS_REQUEST]: emptyProps(),
    [actionTypes.EVENTS_RESPONSE]: (events: IEvent[]) => ({ events }),
    [actionTypes.EVENTS_FAILURE]: (error: any) => ({ error }),
  }
});
