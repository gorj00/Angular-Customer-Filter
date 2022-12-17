import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerFilterComponent } from './containers/customer-filter/customer-filter.component';

const routes: Routes = [
  { path: '', component: CustomerFilterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
