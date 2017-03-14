import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import {Report} from '../models/report';

import any = jasmine.any;

@Injectable()
export class ReportService {
    public reportList: Report[]= [];
    private dataUrl = 'http://localhost/api/reports.php';
    private headers = new Headers({ 'Authorization': window['xsrfToken'] });

    constructor(private http: Http) { }

    getReports(): Promise<Report[]> {
        return this.http
            .get(this.dataUrl, { headers: this.headers })
            .toPromise()
            .then(res => {
                this.reportList = res.json();
                return res.json();
            })
            .catch(this.handleError);
    }

    public parseCsv(csvText) {
        let textLines = csvText.split(/\r\n|\n/);
        let outputArray = [],
            title = textLines[0].split(','),
            columnsCount = title.length;
        // TODO: this does not properly decode quotes in CSV, by now it OK

        for (let i = 1, n = textLines.length; i < n; i++) {
            if (textLines[i].length) {
                let rowArray = textLines[i].split(',');
                let rowObject = {};
                for (let j = 0; j < columnsCount; j++) {
                    if (title[j].toLowerCase() == 'queries') {
                        rowObject['queries'] = rowArray[j];
                    }
                    else {
                        if (title[j].toLowerCase() == 'ctr') {
                            rowObject['ctr'] = parseFloat(rowArray[j]) / 100;
                        }
                        else {
                            rowObject[title[j].toLowerCase()] = parseFloat(rowArray[j]);
                        }
                    }
                }
                outputArray.push(rowObject);
            }
        }
        return outputArray;
    }

    getReport(id: number): Promise<any> {
        return this.http
            .get(this.dataUrl + '?id=' + id, { headers: this.headers })
            .toPromise()
            .then(response => {
                let all = response.json();
                return {
                    name: all.name,
                    keywords: all.keywords,
                    csv: this.parseCsv(all.csv)
                };
            })
            .catch(this.handleError);
    }

    create(name: string, keywords: string, csv: string): Promise<any> {
        return this.http
            .post(this.dataUrl, {name, keywords, csv}, { headers: this.headers })
            .toPromise()
            .then(response => response.text())
            .catch(this.handleError);
    }

    update(id: number, name: string, keywords: string, csv: string): Promise<any> {
        return this.http
            .put(this.dataUrl + '?id=' + id, {name, keywords, csv}, { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    delete(id: number): Promise<any> {
        return this.http
            .delete(this.dataUrl + '?id=' + id, { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}