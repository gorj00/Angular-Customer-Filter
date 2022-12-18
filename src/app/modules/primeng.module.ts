import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule}  from 'primeng/dropdown';
import { TabMenuModule } from 'primeng/tabmenu';

@NgModule({
  imports: [CommonModule],
  exports: [AutoCompleteModule, ButtonModule, ListboxModule, DropdownModule, TabMenuModule],
})
export class PrimeNgModule { }
