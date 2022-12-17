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
  ).pipe(
    map(([events]) => ({events})),
    shareReplay({ bufferSize: 1, refCount: true})
  )

  ngOnInit(): void {
    this.filtersForm.valueChanges.subscribe(v => console.log(v))
  }

}
