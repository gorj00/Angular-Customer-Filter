import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule}  from 'primeng/dropdown';

@NgModule({
  imports: [CommonModule],
  exports: [AutoCompleteModule, ButtonModule, ListboxModule, DropdownModule],
})
export class PrimeNgModule { }
