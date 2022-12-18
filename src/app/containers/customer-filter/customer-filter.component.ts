import { EventsFacade } from './../../store/events/events.facade';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, buffer, combineLatest, map, Observable, shareReplay, startWith, Subject, tap } from 'rxjs';
import { IEvent, IEventsData, IFormStep, IFormProperty, IProperty, EOperators, IOperators } from 'src/app/models/events.models';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';

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

  initialFiltersFormValue: {steps: FormArray<FormGroup>} = {
    steps: this.fb.array([
      // Setup initial 1st step
      this.fb.group({
        customerEvent: ['', Validators.required],
        properties: this.fb.array([]) as FormArray
      })
    ]) as FormArray<FormGroup>
  }

  // Filters form related
  filtersForm = this.fb.group({...this.initialFiltersFormValue})

  resetFiltersForm() {
    const resetVal = {
      steps: [{customerEvent: '', properties: [] }]
    }
    // Simple reset not working properly, have to manually remove all and then reset first step
    const stepsLength = this.steps.length
    const steps = this.steps

    for (let i = 0; i < stepsLength; i++) {
      steps.removeAt(i)
    }
    this.filtersForm.reset(resetVal)

  }

  get steps() {
    return this.filtersForm.controls["steps"] as FormArray<FormGroup>;
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

  cloneStep(stepIndex: number) {
    const stepCtrls = this.steps.at(stepIndex).controls
    const stepProps = stepCtrls['properties'] as FormArray
    const stepForm = this.fb.group({
      customerEvent: [stepCtrls['customerEvent'].value, Validators.required],
      properties: this.fb.array([...stepProps.controls]) as FormArray
    });
    this.steps.push(stepForm as FormGroup);
  }

  onApplyFilters() {
    if (this.steps.length) {
      console.log(this.filtersForm.value)
    }
  }

  // Final data object
  data$ = combineLatest(
    this.events$,
  ).pipe(
    map(([events]) => ({events})),
    // tap(obj => console.log(obj)),
    shareReplay({ bufferSize: 1, refCount: true})
  )

  ngOnInit(): void {
    this.filtersForm.valueChanges.subscribe(v => console.log(v))
  }

}
