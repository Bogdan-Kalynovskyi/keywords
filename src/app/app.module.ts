import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RoutingModule } from './routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
        ReactiveFormsModule,
        HttpModule,
        RoutingModule,
        BrowserAnimationsModule,
        MaterialModule
    ],
    providers: [ReportService],
    bootstrap: [AppComponent],
    entryComponents: [NewReportDialog]
})
export class AppModule { }