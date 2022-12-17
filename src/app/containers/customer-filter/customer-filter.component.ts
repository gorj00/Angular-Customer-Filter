import { EventsFacade } from './../../store/events/events.facade';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, buffer, combineLatest, map, Observable, shareReplay, tap } from 'rxjs';
import { IEvent, IEventsData, IFormStep, IFromProperty } from 'src/app/models/events.models';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-filter',
  templateUrl: './customer-filter.component.html',
  styleUrls: ['./customer-filter.component.less']
})
export class CustomerFilterComponent implements OnInit {

  // Subjects
  eventsQueryBehaviorSubject = new BehaviorSubject<string>('')
  eventsQuery$ = this.eventsQueryBehaviorSubject.asObservable()

  constructor(
    private eventsFacade: EventsFacade,
    private fb: FormBuilder,
  ) { }

  // Data related
  events$: Observable<IEventsData> = this.eventsFacade.events$.pipe(
    map(events => ({
      types: events ? events.map(item => item.type) : []
    })),
    shareReplay({ bufferSize: 1, refCount: true})
  )

  filteredEventsTypes$ = combineLatest(
    this.events$,
    this.eventsQuery$
  ).pipe(
    map(([{ types }, eventsQuery]) => {
      const filtered = []
      for (let type of types) {
        if (type.replace('_', ' ').toLowerCase().indexOf(eventsQuery.toLowerCase()) === 0) {
          filtered.push(type);
        }
      }
      return filtered
    })
  )

  // Filters form related
  filtersForm = this.fb.group({
    steps: this.fb.array([
      // Setup initial 1st step
      this.fb.group({
        customerEvent: [''],
        properties: this.fb.array([])
      })
    ])
  })

  get steps() {
    return this.filtersForm.controls["steps"] as FormArray<FormGroup>;
  }

  search(event: any) {
    // this.suggestions = [...this.suggestions]
    this.eventsQueryBehaviorSubject.next(event.query)
  }
  // suggestions = ['Hello', 'Nope']


  addStep() {
    const stepForm = this.fb.group({
        customerEvent: [''],
        properties: this.fb.array([])
    });


    this.steps.push(stepForm as FormGroup);
  }

  removeStep(stepIndex: number) {
    this.steps.removeAt(stepIndex)
  }

  getStepEventProperties(stepIndex: number) {
    return this.filtersForm.controls['steps'].at(stepIndex).controls['properties']  as FormArray;
  }

  addStepProperty(stepIndex: number) {
    const propertyForm = this.fb.group<IFromProperty>({
      propertyName: [''],
      type: [''],
      operator: [''],
      propertyValue: [''],
      partTwoPropertyValue: [''],
  });
    this.getStepEventProperties(stepIndex).push(propertyForm)
  }

  removeStepProperty(stepIndex: number, propertyIndex: number) {
    this.getStepEventProperties(stepIndex).removeAt(propertyIndex)
  }

  // Final data object
  data$ = combineLatest(
    this.events$,
    this.filteredEventsTypes$,
  ).pipe(
    map(([events, filteredEventsTypes]) => ({events, filteredEventsTypes}))
  )

  ngOnInit(): void {
    this.filtersForm.valueChanges.subscribe(v => console.log(v))
  }

}
