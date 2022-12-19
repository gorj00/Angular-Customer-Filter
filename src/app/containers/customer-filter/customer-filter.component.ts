import { EventsFacade } from './../../store/events/events.facade';
import { Component, OnInit } from '@angular/core';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';
import { IEventsData,IProperty } from 'src/app/models/events.models';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { FiltersFormCleanupService } from 'src/app/services/filters-form-cleanup.service';

@Component({
  selector: 'app-customer-filter',
  templateUrl: './customer-filter.component.html',
  styleUrls: ['./customer-filter.component.less']
})
export class CustomerFilterComponent implements OnInit {

  constructor(
    private eventsFacade: EventsFacade,
    private fb: FormBuilder,
    private filterFormService: FiltersFormCleanupService,
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
    // Native form reset was unpredictable, applied custom logic for reset
    // Add new fresh step and remove all preceeding it
    this.addStep()
    const stepsLengthExceptLast = this.steps.length - 1

    for (let i = 0; i < stepsLengthExceptLast; i++) {
      this.steps.removeAt(0)
    }

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
      const filtersFormOutput = this.filtersForm.value
      this.filterFormService.logFiltersFormOutput(filtersFormOutput)
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
    // this.filtersForm.valueChanges.subscribe(v => console.log(v))
  }

}
