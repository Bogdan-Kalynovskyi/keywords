import { Router } from '@angular/router';
import { Component, OnInit, Inject} from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DOCUMENT } from '@angular/platform-browser';

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
    dialogRef: MdDialogRef<NewReportDialog>;

    constructor(
        @Inject(DOCUMENT) private document: any,
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

    isActive(id: number): boolean {
        const urlId = this.document.location.pathname.split('/')[2];
        return urlId == id;
    }

    onAdd(): void {
        this.dialogRef = this.dialog.open(NewReportDialog);
        this.dialogRef.componentInstance.reportList = this.reports;
    }

    delete(report: Report): void {
        if (window['confirm']('Are you sure?')) {
            this.reportService
            .delete(report.id)
            .then(() => {
                this.reports = this.reports.filter(h => h !== report);
                if (this.selectedReport === report) {
                    this.selectedReport = null;
                }
            });
            this.router.navigate(['']);
        }
    }

}

@Component({
    selector: 'new-report-dialog',
    templateUrl: 'new_report_form.html'
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
        reader.onload = (theFile => e => {
            this.newReportData = e.target.result;
        })(ev.target.files[0]);
        reader.readAsText(ev.target.files[0]);
    }

    addReport(name: string, keywords: string, siteUrl: string) {
        this.dialogRef.close();
        this.reportService.create(name, keywords, siteUrl, this.newReportData)
            .then(reportId => {
                this.reportList.unshift({
                    id: reportId,
                    name: name,
                    keywords: keywords,
                    siteUrl: siteUrl
                });
                this.router.navigate(['/dashboard', reportId]);
            });
    }

    reportDataPrepare(name: string, keywords: string, siteUrl: string) {
        if (siteUrl) {
            this.reportService.getGoogleData(siteUrl)
                .then(data => {
                    this.newReportData = data['csv'];
                    this.addReport(name, keywords, siteUrl);
                });
            if (!window['hasOfflineAccess']) {
                let gapi = window['gapi'];
                let auth = gapi.auth2.getAuthInstance();
                let user = auth.currentUser.get();
                auth.grantOfflineAccess({
                    authuser: user.getAuthResponse().session_state.extraQueryParams.authuser
                }).then((response) => {
                    this.reportService.setUserCode(response.code);
                });
            }
        } else {
            this.addReport(name, keywords, siteUrl);
        }
    }
}