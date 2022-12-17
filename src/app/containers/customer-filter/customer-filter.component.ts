import { EventsFacade } from './../../store/events/events.facade';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, buffer, combineLatest, map, Observable, shareReplay, startWith, Subject, tap } from 'rxjs';
import { IEvent, IEventsData, IFormStep, IFormProperty, IProperty } from 'src/app/models/events.models';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-filter',
  templateUrl: './customer-filter.component.html',
  styleUrls: ['./customer-filter.component.less']
})
export class CustomerFilterComponent implements OnInit {

  // Subjects
  // eventsQueryBSubject = new BehaviorSubject<string>('')
  // eventsQuery$ = this.eventsQueryBSubject.asObservable()
  // propertyQuerySubject = new Subject<{ eventType: string | null, query: string }>()
  // propertyQuery$ = this.propertyQuerySubject.asObservable()

  // addEventAttributeButtonShowBSubject = new BehaviorSubject<{ [key: number]: boolean }>({ 0: false })
  // addEventAttributeButtonShow$ = this.addEventAttributeButtonShowBSubject.asObservable()


  constructor(
    private eventsFacade: EventsFacade,
    private fb: FormBuilder,
  ) { }

  // Data related
  events$: Observable<IEventsData> = this.eventsFacade.events$.pipe(
    map(events => {
      console.log(events)
      // const types = events ? events.map(item => item) : []
      const propertiesByEvent: { [key: string]: IProperty[]} = {}
      events?.length && events.forEach(event => {
        propertiesByEvent[event.type] = event.properties
      })
      return ({
        events,
        propertiesByEvent,
      })
    }),
    shareReplay({ bufferSize: 1, refCount: true})
  )

  // filteredEventsTypes$ = combineLatest(
  //   this.events$,
  //   this.eventsQuery$
  // ).pipe(
  //   map(([{ events }, eventsQuery]) => {
  //     const filtered = []
  //     for (let event of events) {
  //       if (type.replace('_', ' ').toLowerCase().indexOf(eventsQuery.toLowerCase()) === 0) {
  //         filtered.push(type);
  //       }
  //     }
  //     return filtered
  //   })
  // )


  // filteredProperties$ = combineLatest(
  //   this.events$,
  //   this.propertyQuery$
  // ).pipe(
  //   map(([{ propertiesByEvent }, propertyQueryObj]) => {
  //     const filtered = []
  //     const propertiesForCurrentType = propertyQueryObj.eventType ? propertiesByEvent[propertyQueryObj.eventType] : []
  //     for (let property of propertiesForCurrentType) {
  //       if (property.property.replace('_', ' ').toLowerCase().indexOf(propertyQueryObj.query.toLowerCase()) === 0) {
  //         filtered.push(property.property);
  //       }
  //     }
  //     return filtered
  //   }),
  //   startWith([])
  // )

  // Filters form related
  filtersForm = this.fb.group({
    steps: this.fb.array([
      // Setup initial 1st step
      this.fb.group({
        customerEvent: ['', Validators.required],
        properties: this.fb.array([]) as FormArray
      })
    ])
  })

  get steps() {
    return this.filtersForm.controls["steps"] as FormArray<FormGroup>;
  }

  // onSearchEvents(event: any) {
  //   this.eventsQueryBSubject.next(event.query)
  // }

  // onSearchProperties(stepIndex: number, event: any) {
  //   const type = this.getStepCustomerEventValue(stepIndex)
  //   this.propertyQuerySubject.next({ eventType: type, query: event.query})
  // }

  getFormPropertyValue(step: number, controlIndex: number) {
    return this.getStepEventProperties(step).at(controlIndex).value
  }

  addStep() {
    const stepForm = this.fb.group({
        customerEvent: ['', Validators.required],
        properties: this.fb.array([]) as FormArray
    });


    this.steps.push(stepForm as FormGroup);
  }

  removeStep(stepIndex: number) {
    this.steps.removeAt(stepIndex)
  }

  getStepCustomerEventControl(stepIndex: number) {
    return this.filtersForm.controls['steps'].at(stepIndex).controls['customerEvent'];
  }

  getStepCustomerEventValue(stepIndex: number): string {
    const value = this.getStepCustomerEventControl(stepIndex).value
    return value ? value : ''
  }

  getStepEventProperties(stepIndex: number) {
    return this.filtersForm.controls['steps'].at(stepIndex).controls['properties'] as FormArray<FormGroup>;
  }

  addStepProperty(stepIndex: number) {
    const propertyForm = this.fb.group({
      propertyName: [''],
      type: [''],
      operator: [''],
      propertyValue: [''],
      partTwoPropertyValue: [''],
  });
    this.getStepEventProperties(stepIndex).push(propertyForm as FormGroup)
  }

  removeStepProperty(stepIndex: number, propertyIndex: number) {
    this.getStepEventProperties(stepIndex).removeAt(propertyIndex)
  }

  // Final data object
  data$ = combineLatest(
    this.events$,
    // this.filteredEventsTypes$,
    // this.filteredProperties$,
  ).pipe(
    map(([events, /* filteredEventsTypes, filteredProperties */]) => ({events, /* filteredEventsTypes, filteredProperties */})),
    shareReplay({ bufferSize: 1, refCount: true})
  )

  ngOnInit(): void {
    this.filtersForm.valueChanges.subscribe(v => console.log(v))
  }

}
