import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { RoutingModule } from './routing.module';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ReportsListComponent, SelectedReportDialog } from './reports-list/reports-list.component';
import { InputDataComponent} from './input-data/input-data.component';
import { FilteredDataComponent} from './filtered-data/filtered-data.component';
import { AllQueriesDataComponent} from './all-queries-data/all-queries-data.component';

import { InputDataService } from './services/input-data.service';
import { ReportService } from './services/report.service';
import { InMemoryDataService } from './services/in-memory-data.service';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
    declarations: [
        AppComponent,
        InputDataComponent,
        FilteredDataComponent,
        AllQueriesDataComponent,
        ReportsListComponent,
        SelectedReportDialog,
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
    bootstrap: [AppComponent]
})
export class AppModule { }