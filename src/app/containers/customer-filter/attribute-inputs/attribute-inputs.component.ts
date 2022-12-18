import { IProperty, EOperators } from 'src/app/models/events.models';
import { MenuItem } from 'primeng/api';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-attribute-inputs',
  templateUrl: './attribute-inputs.component.html',
  styleUrls: ['./attribute-inputs.component.less']
})
export class AttributeInputsComponent implements OnInit {
  @Input() i!: number // Step iteration
  @Input() j!: number // Property iteration
  @Input() property!: FormGroup
  @Input() isPropertyNameSelected!: boolean
  @Input() optionsOperators!: EOperators[]
  @Input() operatorsDropdownHeaderTabs!: MenuItem[]
  @Input() activeOperatorsTab!: MenuItem
  @Input() propertyType!: string
  @Input() propertyOperator!: string
  @Input() propertiesByEventOptions!: IProperty[]
  @Input() stepCustomerEventValue!: string
  @Output() changeActiveOperatorsTabAction = new EventEmitter<{
    event: any, i: number, j: number
  }>()
  @Output() removeStepPropertyAction = new EventEmitter<{
    i: number, j: number
  }>()
  @Output() selectPropertyAction = new EventEmitter<{
    event: any, i: number, j: number
  }>()

  // To access in the template
  EOperators = EOperators

  constructor() { }

  onChangeActiveOperatorsTab(
    event: any, stepIndex: number, propertyIndex: number
  ) {
    this.changeActiveOperatorsTabAction.emit({
      event, i: stepIndex, j: propertyIndex
    })
  }

  onSelectProperty(
    event: any, stepIndex: number, propertyIndex: number
  ) {
    this.selectPropertyAction.emit({
      event, i: stepIndex, j: propertyIndex
    })
  }

  onRemoveStepProperty(stepIndex: number, propertyIndex: number) {
    this.removeStepPropertyAction.emit({i: stepIndex, j: propertyIndex})
  }

  ngOnInit(): void {
  }

}
