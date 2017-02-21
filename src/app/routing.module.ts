import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportsListComponent } from './reports-list/reports-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'reportsList',
        component: ReportsListComponent
    },
    {
        path: 'dashboard/:id',
        component: DashboardComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }
