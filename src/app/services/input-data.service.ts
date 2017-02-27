import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {InputDataRow} from '../models/input-data-row';

@Injectable()
export class InputDataService {

    private loadDataPromise;
    private data: InputDataRow[];
    private dataUrl = 'app/inputRows';
    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private http: Http) {
    }

    loadData(report_id: number): Promise<InputDataRow[]> {
        if (!this.loadDataPromise) {
            this.loadDataPromise = this.http.get(this.dataUrl);
        }
        return this.loadDataPromise
            .toPromise()
            .then(response => {
                this.data = response.json().data as InputDataRow[];
                return this.data;
            })
            .catch(this.handleError);
    }

    getInputDataRows() {
        return this.data;
    }

    getInputDataRow(id: number) {
        return this.getInputDataRows().find(input_data_row => input_data_row.id === id);
    }

    create(query: string): Promise<InputDataRow> {
        return this.http
            .post(this.dataUrl, JSON.stringify({ query: query }), { headers: this.headers })
            .toPromise()
            .then(res => res.json().data)
            .catch(this.handleError);
    }

    update(input_data_row: InputDataRow): Promise<InputDataRow> {
        const url = `${this.dataUrl}/${input_data_row.id}`;
        return this.http.put(url, JSON.stringify(input_data_row), { headers: this.headers })
            .toPromise()
            .then(() => input_data_row)
            .catch(this.handleError);
    }

    delete(id: number): Promise<void> {
        const url = `${this.dataUrl}/${id}`;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    // parseData(file: string) {
    //     alert('Data parsed');
    //     //this.reportData = {};
    //     // return this.data
    //     //     .toPromise()
    //     //     .then(res => res.json().data)
    //     //     .catch(this.handleError);
    //
    // }

    // dataCalculate(reportData: any, reportKeywords: string) {
    //     alert('Data is calculated');
    // }

    dataSave(reportId: number, reportData: any): Promise<void> {
        return this.http
            .post(this.dataUrl, JSON.stringify({ reportData: reportData,  }), { headers: this.headers })
            .toPromise()
            .then(res => res.json().data)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
