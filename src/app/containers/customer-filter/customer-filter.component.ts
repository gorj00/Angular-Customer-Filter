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

  // Subjects
  // eventsQueryBSubject = new BehaviorSubject<string>('')
  // eventsQuery$ = this.eventsQueryBSubject.asObservable()
  // propertyQuerySubject = new Subject<{ eventType: string | null, query: string }>()
  // propertyQuery$ = this.propertyQuerySubject.asObservable()

  // addEventAttributeButtonShowBSubject = new BehaviorSubject<{ [key: number]: boolean }>({ 0: false })
  // addEventAttributeButtonShow$ = this.addEventAttributeButtonShowBSubject.asObservable()

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

  getStepEventPropertyControlValue(stepIndex: number, propertyIndex: number, controlName: string): string {
    return this.getStepEventProperties(stepIndex).at(propertyIndex).controls[controlName].value
  }

  isPropertyNameSelected(stepIndex: number, propertyIndex: number): boolean {
    return !!this.getStepEventPropertyControlValue(stepIndex, propertyIndex, 'propertyName')
  }

  addStepProperty(stepIndex: number) {
    const propertyForm = this.fb.group({
      propertyName: [''],
      type: [''],
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
    const { type } = event.value
    const prop = this.getStepEventProperties(stepIndex).at(propertyIndex)

    // Prefill type and operator controls
    prop.controls['type'].setValue(type)
    if (type === 'string') {
      prop.controls['operator'].setValue(EOperators.EQUALS)
    } else if (type === 'number') {
      prop.controls['operator'].setValue(EOperators.EQUAL_TO)
      prop.controls['propertyValue'].setValue(0)
      // // In between case
      // prop.controls['propertyValuePartTwo'].setValue(0)
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
    // this.filteredEventsTypes$,
    // this.filteredProperties$,
  ).pipe(
    map(([events, /* filteredEventsTypes, filteredProperties */]) => ({events, /* filteredEventsTypes, filteredProperties */})),
    tap(obj => console.log(obj)),
    shareReplay({ bufferSize: 1, refCount: true})
  )

  ngOnInit(): void {
    this.filtersForm.valueChanges.subscribe(v => console.log(v))
  }

}
