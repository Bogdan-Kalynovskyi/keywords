import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InputDataRowsComponent } from './input-data-rows/input-data-rows.component';
import { ReportsListComponent } from './reports-list/reports-list.component';


const routes: Routes = [
  {
    path: '',
    component: ReportsListComponent
  },
  {
    path: 'inputDataRows',
    component: InputDataRowsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
