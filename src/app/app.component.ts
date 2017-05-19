import { Component } from '@angular/core';
import { ReportService } from './services/report.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ReportService]
})

export class AppComponent {
    email: string;

    constructor(
        private reportService: ReportService
    ) {
        this.email = window['userEmail'];
    }

    logout() {
        this.reportService.logout();
    }
}
