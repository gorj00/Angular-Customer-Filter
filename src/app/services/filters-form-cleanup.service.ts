import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class FiltersFormCleanupService {

  constructor() {}

  logFiltersFormOutput(filtersFormOutput: Partial<{ steps: any[]; }>) {
    // Data model
    const cleanedFiltersFormOutput: {
      validStepsCount: number;
      invalidStepsCount: number;
      validSteps: any[];
      invalidSteps: any[];
    } = {
      validStepsCount: 0,
      invalidStepsCount: 0,
      validSteps: [],
      invalidSteps: [],
    }


    if (filtersFormOutput.steps) {
      // Go trough steps ...
      for (let [i, step] of filtersFormOutput.steps.entries()) {
        const cleanedStep: { stepOrder: number | null; event: string; eventProperties: any[] } = {
          stepOrder: null,
          event: step.customerEvent,
          eventProperties: [],
        }
        if (step.properties?.length) {
          // Property evaluation model
          const propertyEvaluation = {
            typeOverriden: false,
            inputsValid: false,
            allInputsProps: false,
          }
          // ... and its properties ...
          for (let prop of step.properties) {
            // All props check
            if (prop.operator && prop.propertyName && prop.type) {
              propertyEvaluation.allInputsProps = true
              // Type check
              if (prop.type === 'number') {
                if (typeof prop.propertyValue === 'number') {
                  propertyEvaluation.inputsValid = true
                  if (prop.operator === 'in between' && typeof prop.propertyValuePartTwo !== 'number') {
                    propertyEvaluation.inputsValid = false
                    propertyEvaluation.allInputsProps = false
                  }
                }
              } else if (prop.type === 'string' && prop.propertyValue) {
                propertyEvaluation.inputsValid = true
              }

              // Type override check
              if (prop.type !== prop.propertyObject.type) {
                propertyEvaluation.typeOverriden = true
              }
            }

            // If property valid, form cleaned output
            if (propertyEvaluation.inputsValid && propertyEvaluation.allInputsProps) {
              const cleanedProperty = {
                propertyName: prop.propertyName,
                type: prop.type,
                value: prop.type === 'string' ? prop.propertyValue : prop.type === 'number' ? prop.operator === 'in between' ? { value1: +prop.propertyValue, value2: +prop.propertyValuePartTwo } : +prop.propertyValue : null,
                originalType: prop.propertyObject?.type,
                operator: prop.operator,
                propertyEvaluation,
              }
              cleanedStep.stepOrder = i + 1
              cleanedStep.eventProperties.push(cleanedProperty)
            }

          }

          if (step.properties.length === cleanedStep.eventProperties.length) {
            // ... and push it as valid
            cleanedFiltersFormOutput.validStepsCount = cleanedFiltersFormOutput.validStepsCount + 1
            cleanedFiltersFormOutput.validSteps.push(cleanedStep)
          } else {
            // ... or return the original as invalid
            cleanedFiltersFormOutput.invalidStepsCount = cleanedFiltersFormOutput.invalidStepsCount + 1
            cleanedFiltersFormOutput.invalidSteps.push(step)
          }
        }
      }
    }

    console.log('Original form output ', filtersFormOutput)
    console.log('Sorted and cleaned output ', cleanedFiltersFormOutput)
  }


}
