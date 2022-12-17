import { FormArray, FormControl } from "@angular/forms";

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

export interface IFromProperty {
    propertyName: string[];
    type: string[];
    operator: string[];
    propertyValue: string[];
    partTwoPropertyValue: string[];
}

export interface IFormStep {
  customerEvent: string[];
  properties: FormArray<FormControl<unknown>>;
}

export interface IEventsData {
  types: string[];
}
