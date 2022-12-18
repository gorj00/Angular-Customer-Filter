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

  operators: IOperators = {
    string: [
      EOperators.EQUALS,
      EOperators.DOES_NOT_EQUAL,
      EOperators.CONTAINS,
      EOperators.DOES_NOT_CONTAIN,
    ],
    number: [
      EOperators.EQUAL_TO,
      EOperators.IN_BETWEEN,
      EOperators.LESS_THAN,
      EOperators.GREATEN_THAN,
    ],
  }

  operatorsDropdownHeaderTabs: MenuItem[] = [
    {label: 'STRING', icon: 'pi pi-fw pi-info'},
    {label: 'NUMBER', icon: 'pi pi-fw pi-hashtag'},
  ]

  // To access in the template
  EOperators = EOperators

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
    const reserVal = {
      steps: [{customerEvent: '', properties: [] }]
    }
    // Simple reset not working properly, have to manually remove all and then reset first step
    const stepsLength = this.steps.length
    const steps = this.steps
    for (let i = 0; i < stepsLength; i++) {
      if (i === 0) {
        // Handle first initial step
        const firstStepProps = this.getStepEventProperties(0)
        const firstStepPropsLength = this.getStepEventProperties(0).length
        for (let i = 0; i < firstStepPropsLength; i++) {
          firstStepProps.removeAt(i)
        }
      } else {
        steps.removeAt(i)
      }
    }

    this.filtersForm.reset(reserVal)
  }

  get steps() {
    return this.filtersForm.controls["steps"] as FormArray<FormGroup>;
  }

  getFormPropertyValue(step: number, controlIndex: number) {
    return this.getStepEventProperties(step).at(controlIndex).value
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

  getStepEventPropertyControlValue(stepIndex: number, propertyIndex: number, controlName: string): string {
    return this.getStepEventProperties(stepIndex).at(propertyIndex).controls[controlName].value
  }

  getPropertyType(stepIndex: number, propertyIndex: number) {
    return this.getStepEventPropertyControlValue(stepIndex, propertyIndex, 'type')
  }

  getPropertyOperator(stepIndex: number, propertyIndex: number) {
    return this.getStepEventPropertyControlValue(stepIndex, propertyIndex, 'operator')
  }

  getPropertyPropertyName(stepIndex: number, propertyIndex: number): string {
    return this.getStepEventPropertyControlValue(stepIndex, propertyIndex, 'propertyName')
  }

  isPropertyNameSelected(stepIndex: number, propertyIndex: number): boolean {
    return !!this.getStepEventPropertyControlValue(stepIndex, propertyIndex, 'propertyName')
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

  addStepProperty(stepIndex: number) {
    const propertyForm = this.fb.group({
      propertyObject: [], // { property, type }
      propertyName: [''],
      type: [''], // user may select different from propertyObject
      operator: [''],
      propertyValue: [''],
      // For number in between case
      propertyValuePartTwo: [''],
  });
    this.getStepEventProperties(stepIndex).push(propertyForm as FormGroup)
  }

  removeStepProperty(stepIndex: number, propertyIndex: number) {
    this.getStepEventProperties(stepIndex).removeAt(propertyIndex)
  }

  onSelectProperty(event: any, stepIndex: number, propertyIndex: number) {
    const { property, type } = event.value
    const prop = this.getStepEventProperties(stepIndex).at(propertyIndex)
    prop.controls['propertyName'].setValue(property)

    // Prefill type and operator controls
    prop.controls['type'].setValue(type)
    if (type === 'string') {
      prop.controls['operator'].setValue(EOperators.EQUALS)
    } else if (type === 'number') {
      prop.controls['operator'].setValue(EOperators.EQUAL_TO)
      prop.controls['propertyValue'].setValue(0)
      // In between case
      prop.controls['propertyValuePartTwo'].setValue(0)
    }
  }

  getActiveOperatorsTab(stepIndex: number, propertyIndex: number): MenuItem {
    const type = this.getStepEventPropertyControlValue(stepIndex, propertyIndex, 'type')
    const menuItem = this.operatorsDropdownHeaderTabs.find((item: MenuItem) => item.label?.toLowerCase() === type)
    return menuItem ? menuItem : this.operatorsDropdownHeaderTabs[0]
  }

  onChangeActiveOperatorsTab(event: any, stepIndex: number, propertyIndex: number) {
    // Workaround as the TabMenu docs's activeItemChange event was not firing the selected tab
    const tabChoice = event.target.innerText;
    const prop = this.getStepEventProperties(stepIndex).at(propertyIndex)
    const typeControl = prop.controls['type']
    typeControl.setValue(tabChoice?.toLowerCase())
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
