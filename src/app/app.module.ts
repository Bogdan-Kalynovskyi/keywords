import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { RoutingModule } from './routing.module';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ReportsListComponent, NewReportDialog } from './reports-list/reports-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { InputDataService } from './services/input-data.service';
import { ReportService } from './services/report.service';
import { InMemoryDataService } from './services/in-memory-data.service';

@NgModule({
    declarations: [
        AppComponent,
        ReportsListComponent,
        NewReportDialog,
        DashboardComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RoutingModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService),
        MaterialModule.forRoot()
    ],
    providers: [InputDataService, ReportService],
    bootstrap: [AppComponent],
    entryComponents: [NewReportDialog]
})
export class AppModule { }