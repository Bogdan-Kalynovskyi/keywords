import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Report } from '../models/report';
import { ReportService } from '../services/report.service';

@Component({
    selector: 'app-reports-list',
    templateUrl: './reports-list.component.html',
    styleUrls: ['./reports-list.component.css'],
    providers: [ReportService]
})
export class ReportsListComponent implements OnInit {
    selectedReport: Report;
    reports: Report[];

    constructor(
        private reportService: ReportService,
        private router: Router) { }

    ngOnInit(): void {
        this.getReportsList();
    }

    getReportsList(): void {
     this.reportService.getReports().then(reports =>
         this.reports = reports);
   }

  add(name: string, keywords: string[]): void {
    name = name.trim();
    if (!name) { return; }
    this.reportService.create(name, keywords)
        .then(report => {
          this.reports.push(report);
          this.selectedReport = null;
        });
  }

  delete(report: Report): void {
    this.reportService
        .delete(report.id)
        .then(() => {
          this.reports = this.reports.filter(h => h !== report);
          if (this.selectedReport === report) {
            this.selectedReport = null;
          }
        });
  }


}