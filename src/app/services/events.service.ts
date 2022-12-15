import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEventsResponse } from '../models/events.models';

@Injectable()
export class EventsService {

  constructor(private http: HttpService) {}

  getEvents(): Observable<IEventsResponse> {
    return this.http.Get('https://br-fe-assignment.github.io/customer-events/events.json');
  }

}
