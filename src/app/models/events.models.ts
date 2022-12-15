export interface IEventsResponse {
  events: IEvent[];
}

export interface IEvent {
  type: string;
  properties: IProperty[];
}

export interface IProperty {
  property: string;
  type: string;
}

export interface IEventsState {
  events: IEvent[] | null;
  loading: boolean;
  error: any;
}
