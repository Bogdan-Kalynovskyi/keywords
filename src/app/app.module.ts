import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RoutingModule } from './routing.module';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ReportsListComponent, NewReportDialog } from './reports-list/reports-list.component';
import { DashboardComponent, RoundPipe } from './dashboard/dashboard.component';

import { ReportService } from './services/report.service';

@NgModule({
    declarations: [
        AppComponent,
        ReportsListComponent,
        NewReportDialog,
        DashboardComponent,
        RoundPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RoutingModule,
        MaterialModule.forRoot()
    ],
    providers: [ReportService],
    bootstrap: [AppComponent],
    entryComponents: [NewReportDialog]
})
export class AppModule { }