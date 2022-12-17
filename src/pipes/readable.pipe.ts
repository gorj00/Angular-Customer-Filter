import { Pipe, PipeTransform  } from '@angular/core';

@Pipe({ name: 'readable' })
export class ReadablePipe implements PipeTransform  {
  transform(snailCaseStr: string, type: 'snail' | 'camel' = 'snail') {
    switch (type) {
      case 'snail':
        return snailCaseStr.replace('_', ' ');
      // Camel case
      default:
        return snailCaseStr;
    }
  }
}
