import { Router } from '@angular/router';
import { Component, OnInit, Inject, NgZone} from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DOCUMENT } from '@angular/platform-browser';

import { Report } from '../models/report';
import { ReportService } from '../services/report.service';
import {InputDataRow, SeoData} from "../models/input-data-row";

import {FormControl} from '@angular/forms';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

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
        this.dialogRef = this.dialog.open(NewReportDialog/*, this*/);
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
    data: InputDataRow[];
    csvParsedReadyToSave: SeoData;
    reportList: Report[];
    siteList: string[];
    changeUrlPromise: Promise<any>;
    isApiAllowed: boolean;
    isGoogle;
    siteUrl;
    siteCtrl: FormControl;
    filteredSites: any;

    constructor(
        public dialogRef: MdDialogRef<NewReportDialog>,
        //public opener: any,
        private reportService: ReportService,
        private _ngZone: NgZone,
        private router: Router) {

        this.isApiAllowed = window['isApiAllowed'];
        this.siteList = window['siteList'];
        window['newReportRef'] = {component: this, zone: _ngZone};

        this.siteCtrl = new FormControl();
        this.filteredSites = this.siteCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterSites(name));

    }

    filterSites(val: string) {
        return val ? this.siteList.filter(s => new RegExp(`${val}`, 'gi').test(s))
            : this.siteList;
    }

    setAllowedApi(status) {
        this.isApiAllowed = status;
    }


    setSitesList(sitesList) {
        this.siteList = sitesList;
    }


    auth() {
        window['auth2Login']();
    }


    onFileChange(ev){
        let reader = new FileReader();
        reader.onload = (theFile => e => {
            [this.data, this.csvParsedReadyToSave] = this.reportService.parseCsv(e.target.result);
        })(ev.target.files[0]);
        reader.readAsText(ev.target.files[0]);
    }

    testUrl(url) {
        return url && /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
    }

    onUrlChange(siteUrl){
        if (this.testUrl(siteUrl)) {
            document.getElementById('addButton').removeAttribute('disabled');
            this.reportService.getDataFromGoogleApi(siteUrl)
                .then(data => {
                    [this.data, this.csvParsedReadyToSave] = data;
                });
        }
        else {
            document.getElementById('addButton').setAttribute('disabled', '');
        }
    }


    addReport(name: string, keywords: string, isGoogle: boolean, siteUrl: string) {
        this.reportService.create(name, keywords, isGoogle, siteUrl, this.csvParsedReadyToSave)
            .then(reportId => {
                this.reportList.unshift({
                    id: reportId,
                    name: name,
                    keywords: keywords,
                    isGoogle: isGoogle,
                    siteUrl: siteUrl
                });
                //todo : don't get data from db below!!!
                this.router.navigate(['/dashboard', reportId]);
            });
    }

    saveReport(name: string, keywords: string, isGoogle, siteUrl: string) {
        window['showLoader']();
        this.dialogRef.close();
        setTimeout(() => {
            if (siteUrl) {
                this.reportService.getDataFromGoogleApi(siteUrl)
                    .then(data => {
                        [this.data, this.csvParsedReadyToSave] = data;
                        this.addReport(name, keywords, isGoogle, siteUrl);
                    });

                if (!window['hasOfflineAccess']) {
                    let gapi = window['gapi'];
                    let auth = gapi.auth2.getAuthInstance();
                    let user = auth.currentUser.get();
                    auth.grantOfflineAccess({
                        authuser: user.getAuthResponse().session_state.extraQueryParams.authuser
                    }).then((response) => {
                        this.reportService.setUserCode(response.code);
                        window['hasOfflineAccess'] = true;
                    });
                }
            }
            else {
                // important: if CSV, set siteUrl to '' !!!!!!!!
                this.addReport(name, keywords, isGoogle, '');
            }
        }, 0);
    }
}