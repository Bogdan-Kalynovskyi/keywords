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
    newReport: Report;
    public reports: Report[];
    dialogRef: MdDialogRef<NewReportDialog>;

    constructor(
        private reportService: ReportService,
        private router: Router,
        private dialog: MdDialog) { }

    ngOnInit(): void {
        this.getReportsList();
    }

    getReportsList(): void {
        this.reportService.getReports().then(reports => this.reports = this.reportService.reportList);
    }

    onSelect(report: Report): void {
        this.selectedReport = report;
        this.router.navigate(['/dashboard', this.selectedReport.id]);
    }

    onAdd(): void {
        this.dialogRef = this.dialog.open(NewReportDialog);
        this.dialogRef.componentInstance.reportList = this.reports;
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
    selector: 'new-report-dialog',
    template: `
        <h2>New report</h2>
        <md-input-container>
            <input mdInput #reportName placeholder="Report name" />
        </md-input-container><br>
        <md-input-container>
            <input mdInput #keywords placeholder="Report keywords" />
        </md-input-container><br>
            <input type="file" accept=".csv" (change)="onFileChange($event)"><br><br>
        <button md-raised-button color="primary" (click)="addReport(reportName.value, keywords.value);">Add</button>
        <button md-raised-button (click)="dialogRef.close()">Close</button>
    `
})

export class NewReportDialog {
    newReportData: any;
    reportList: Report[];
    constructor(
        public dialogRef: MdDialogRef<NewReportDialog>,
        private reportService: ReportService,
        private router: Router){
    }

    onFileChange(ev){
        let reader = new FileReader();
        reader.onload = (theFile => e => this.newReportData = e.target.result)(ev.target.files[0]);
        reader.readAsText(ev.target.files[0]);
    }

    addReport(name: string, keywords: string) {
        this.dialogRef.close();
        this.reportService.create(name, keywords.trim(), this.newReportData)
            .then(reportId => {
                this.reportList.push({
                    id: reportId,
                    name: name,
                    keywords: keywords.trim()
                });
                this.router.navigate(['/dashboard', reportId]);
            });
    }
}