import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { Report } from '../models/report';
import { ReportService } from '../services/report.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    @Input()
    report: Report;

    constructor(
        private reportService: ReportService,
        private route: ActivatedRoute,
        private location: Location
    ) { }

    ngOnInit() {
        this.route.params.switchMap((params: Params) =>
            this.reportService.getReport(+params['id'])).subscribe(report => this.report = report);
    }

    goBack(): void {
        this.location.back();
    }

}
