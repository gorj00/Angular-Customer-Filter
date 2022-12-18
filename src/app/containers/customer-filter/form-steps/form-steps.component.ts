import { MenuItem } from 'primeng/api';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { IEvent, IOperators, EOperators, IProperty } from 'src/app/models/events.models';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-steps',
  templateUrl: './form-steps.component.html',
  styleUrls: ['./form-steps.component.less']
})
export class FormStepsComponent implements OnInit {
  @Input() events!: IEvent[] | null
  @Input() propertiesByEvent!: { [key: string]: IProperty[]}
  @Input() steps!: FormArray<FormGroup>
  @Input() filtersForm!: FormGroup<{
    steps: FormArray<FormGroup>;
  }>
  @Output() addStepAction = new EventEmitter<void>()
  @Output() removeStepAction = new EventEmitter<number>()
  @Output() cloneStepAction = new EventEmitter<number>()
  @Output() resetFiltersAction = new EventEmitter<void>()

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

  // To access in the template
  EOperators = EOperators

  operatorsDropdownHeaderTabs: MenuItem[] = [
    {label: 'STRING', icon: 'pi pi-fw pi-info'},
    {label: 'NUMBER', icon: 'pi pi-fw pi-hashtag'},
  ]

  constructor(
    private fb: FormBuilder,
  ) { }

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

  getFormPropertyValue(step: number, controlIndex: number) {
    return this.getStepEventProperties(step).at(controlIndex).value
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

  getActiveOperatorsTab(stepIndex: number, propertyIndex: number): MenuItem {
    const type = this.getStepEventPropertyControlValue(stepIndex, propertyIndex, 'type')
    const menuItem = this.operatorsDropdownHeaderTabs.find((item: MenuItem) => item.label?.toLowerCase() === type)
    return menuItem ? menuItem : this.operatorsDropdownHeaderTabs[0]
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

  onChangeActiveOperatorsTab(event: any, stepIndex: number, propertyIndex: number) {
    // Workaround as the TabMenu docs's activeItemChange event was not firing the selected tab
    const tabChoice = event.target.innerText;
    const prop = this.getStepEventProperties(stepIndex).at(propertyIndex)
    const typeControl = prop.controls['type']
    typeControl.setValue(tabChoice?.toLowerCase())
  }

  getStepEventPropertyControlValue(stepIndex: number, propertyIndex: number, controlName: string): string {
    return this.getStepEventProperties(stepIndex).at(propertyIndex).controls[controlName].value
  }

  removeStepProperty(stepIndex: number, propertyIndex: number) {
    this.getStepEventProperties(stepIndex).removeAt(propertyIndex)
  }

  onAddStep() {
    this.addStepAction.emit()
  }

  onRemoveStep(stepIndex: number) {
    this.removeStepAction.emit(stepIndex)
  }

  onCloneStep(stepIndex: number) {
    this.cloneStepAction.emit(stepIndex)
  }

  onResetFilters() {
    // If any first step untouched props kept in UI,
    // remove, otherwise they stay in
    const firstStepProps = this.getStepEventProperties(0)
    const firstStepPropsLength = this.getStepEventProperties(0).length
    for (let i = 0; i < firstStepPropsLength; i++) {
      firstStepProps.removeAt(i)
    }
    this.resetFiltersAction.emit()
  }

  ngOnInit(): void {
  }

}
