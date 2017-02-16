import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { RoutingModule } from './routing.module';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { InputDataRowsComponent} from './input-data-rows/input-data-rows.component';

import { InputDataService } from './services/input-data.service';
import { ReportService } from './services/report.service';
import { InMemoryDataService } from './services/in-memory-data.service';

@NgModule({
    declarations: [
        AppComponent,
        InputDataRowsComponent,
        ReportsListComponent
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