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

export enum EOperators {
  EQUALS = 'equals',
  DOES_NOT_EQUAL = 'does not equal',
  CONTAINS = 'contains',
  DOES_NOT_CONTAIN = 'does not contain',
  EQUAL_TO = 'equal to',
  IN_BETWEEN = 'in between',
  LESS_THAN = 'less than',
  GREATEN_THAN = 'greater_than'
}

export interface IOperators {
  [key: string]: EOperators[];
}

export interface IFormProperty {
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
  // types: string[];
  events: IEvent[] | null;
  propertiesByEvent: {[key: string]: IProperty[]};
}
