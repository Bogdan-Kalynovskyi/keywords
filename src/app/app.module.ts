import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { RoutingModule } from './routing.module';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ReportsListComponent, SelectedReportDialog } from './reports-list/reports-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { InputDataComponent} from './input-data/input-data.component';
import { FilteredDataComponent} from './filtered-data/filtered-data.component';
import { AllQueriesDataComponent} from './all-queries-data/all-queries-data.component';

import { InputDataService } from './services/input-data.service';
import { ReportService } from './services/report.service';
import { InMemoryDataService } from './services/in-memory-data.service';
import { ReportComponent } from './report/report.component';
import { NonBrandedComponent } from './non-branded/non-branded.component';
import { CtrStatsComponent } from './ctr-stats/ctr-stats.component';

@NgModule({
    declarations: [
        AppComponent,
        ReportsListComponent,
        SelectedReportDialog,
        DashboardComponent,
        InputDataComponent,
        FilteredDataComponent,
        AllQueriesDataComponent,
        ReportComponent,
        NonBrandedComponent,
        CtrStatsComponent
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