import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Report } from '../models/report';
import { ReportService } from '../services/report.service';
import { InputDataService } from '../services/input-data.service'

@Component({
    selector: 'app-reports-list',
    templateUrl: './reports-list.component.html',
    styleUrls: ['./reports-list.component.css'],
    providers: [ReportService, InputDataService]
})

export class ReportsListComponent implements OnInit {
    selectedReport: Report;
    newReportData: any;
    //newReport: any;
    reports: Report[];
    dialogRef: MdDialogRef<NewReportDialog>;

    constructor(
        private reportData: InputDataService,
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
    }

    onAdd(): void {
        this.dialogRef = this.dialog.open(NewReportDialog);
        //this.newReport = new Report('-1', '', '');
        //this.dialogRef.componentInstance.newReport = this.newReport;
    }

    delete(report: Report): void {
        alert('delete');
        // this.reportService
        //     .delete(report.id)
        //     .then(() => {
        //         this.reports = this.reports.filter(h => h !== report);
        //         if (this.selectedReport === report) {
        //             this.selectedReport = null;
        //         }
        //     });
    }

}

@Component({
    selector: 'new-report-dialog',
    template: `
        <h2>New report</h2>
        <md-input-container>
            <input md-input #reportName placeholder="Report name" />
        </md-input-container><br>
        <md-input-container>
            <input md-input #keywords placeholder="Keywords" />
        </md-input-container><br>
            <input id="file-input" type="file"><br><br>
        <button md-raised-button (click)="addReport(reportName.value, keywords.value, file.value);">Add</button>
        <button md-raised-button (click)="dialogRef.close()">Close</button>
    `
})
export class NewReportDialog {
    public title: string;
    newReport: any;
    constructor(
        public dialogRef: MdDialogRef<NewReportDialog>,
        private reportService: ReportService,
        private router: Router){
    }

    addReport(name: string, keywords: string, file: string) {
        this.dialogRef.close();
        alert('new');
        this.reportService.create(name, keywords, file);
             // .then(reportId => {
             //     this.router.navigate(['/dashboard', reportId]);
             // });
    }
}