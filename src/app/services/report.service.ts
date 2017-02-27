import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {Report} from '../models/report';
import any = jasmine.any;

@Injectable()
export class ReportService {

    private dataUrl = 'app/reports';
    private headers = new Headers({ 'Content-Type': 'application/json' });
    reportData: any;

    constructor(private http: Http) { }

    getReports(): Promise<Report[]> {
        return this.http.get(this.dataUrl)
            .toPromise()
            .then(response => response.json().data as Report[])
            .catch(this.handleError);
    }

    getReport(id: number): Promise<Report> {
        return this.getReports().then(reports => reports.find(report => report.id === id));
    }

    create(name: string, keywords: string, file: string) {
        alert('report service. create');
        // this.http
        //     .post(this.dataUrl, JSON.stringify({ name: name, keywords: keywords }), { headers: this.headers })
            // .toPromise()
            // .then(() => null
                // reportId =>
                //     return reportId
                //         .toPromise())//{
                //this.dataParse(reportId.json().data)
                    //     .then(reportData => {
                    //         this.dataCalculate(reportData);
                    //         return this.dataSave(reportId: reportId, reportData: reportData)
                    //             //.post(this.dataUrl, JSON.stringify({ reportData: reportData,  }), { headers: this.headers })
                    //             //.toPromise()
                    //             .then(() => null)
                    //             .catch(this.handleError);
                    //
                    //}
                // )
            // .catch(this.handleError);
    }

    update(report: Report): Promise<Report> {
        const url = `${this.dataUrl}/${report.id}`;
        return this.http.put(url, JSON.stringify(report), { headers: this.headers })
            .toPromise()
            .then(() => report)
            .catch(this.handleError);
    }

    delete(id: number): Promise<void> {
        const url = `${this.dataUrl}/${id}`;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }


}





