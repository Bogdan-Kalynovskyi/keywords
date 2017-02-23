import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

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
    dialogRef: MdDialogRef<SelectedReportDialog>;

    constructor(
        private reportService: ReportService,
        private router: Router,
        private dialog: MdDialog) { }

    ngOnInit(): void {
        this.getReportsList();
    }

    getReportsList(): void {
        this.reportService.getReports().then(reports =>
            this.reports = reports);
    }

    onSelect(report: Report): void {
        this.selectedReport = report;
        this.router.navigate(['/dashboard', this.selectedReport.id]);
        //this.dialogRef = this.dialog.open(SelectedReportDialog);
        //this.dialogRef.componentInstance.selectedReport = report;
    }

    add(name: string, keywords: string): void {
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

@Component({
    selector: 'selected-report-dialog',
    template: `
        <h2>{{ selectedReport.name | uppercase }}</h2>
        <button md-raised-button color="primary" (click)="gotoDetail()">View details</button>
        <button md-raised-button (click)="dialogRef.close()">Close</button>
    `
})
export class SelectedReportDialog {
    selectedReport: any;
    constructor(
        public dialogRef: MdDialogRef<SelectedReportDialog>,
        private router: Router){
    }

    gotoDetail() {
        //this.dialogRef.close();
        //this.router.navigate(['/inputDataRows', this.selectedReport.id])
    }
}