import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import {Report} from '../models/report';

import any = jasmine.any;
import {InputDataRow} from "../models/input-data-row";

@Injectable()
export class ReportService {
    public reportList: Report[]= [];
    private dataUrl = 'api/reports.php';
    private logoutUrl = 'api/login.php';
    private headers = new Headers({ 'Authorization': window['xsrfToken'] });

    constructor(private http: Http) {
        this.dataUrl = location.protocol + '//' + location.hostname + '/' + this.dataUrl;
    }

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

    public parseCsv(csvText): InputDataRow[] {
        let strDelimiter = ',';

        // Create a regular expression to parse the CSV values.
        let objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );

        let arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        let arrMatches;

        let g = new RegExp( "\"\"", "g" );

        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( csvText )){

            // Get the delimiter that was found.
            let strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
            ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            let strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    g,
                    "\""
                );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        let result = [];

        for (let i = 1, n = arrData.length; i < n; i++) {
            if (arrData[i][0] != "") {
                let x = arrData[i];
                result.push({
                    queries: x[0],
                    clicks: +x[1],
                    impressions: +x[2],
                    ctr: parseFloat(x[3]) / 100,
                    position: +x[4]
                });
            }
        }
        // Return the parsed data.
        return result;
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
                    siteUrl: all.siteUrl,
                    csv: this.parseCsv(all.csv),
                    isOwner: all.isOwner
                };
            })
            .catch(this.handleError);
    }

    convertData(data: string[]): string {

        let str = 'Queries,Clicks,Impressions,CTR,Position\r\n';

        for (let i = 0; i < data.length; i++) {
            str += data[i]['keys'] + ','
                + data[i]['clicks'] + ','
                + data[i]['impressions'] + ','
                + data[i]['ctr'].toFixed(2) + '%,'
                + data[i]['position'].toFixed(1) + '\r\n';
        }

        return str.substr(0, str.length-2);
    }

    getFormattedDate(date) {
        date = date.toString();
        return (date.length == 1) ? date = '0' + date : date;
    }

    getGoogleData(siteUrl): Promise<any> {
        let gapi;
        gapi = window['gapi'];

        let date = new Date();
        let endDate = date.getFullYear() + '-' + this.getFormattedDate(date.getMonth() + 1) + '-' + this.getFormattedDate(date.getDate());
        date.setDate(date.getDate() - 99);
        let startDate = date.getFullYear() + '-' + this.getFormattedDate(date.getMonth() + 1) + '-' + this.getFormattedDate(date.getDate());

        return gapi.client.request({
            path: 'https://www.googleapis.com/webmasters/v3/sites/'+ encodeURIComponent(siteUrl) + '/searchAnalytics/query',
            method: 'POST',
            params: {
                key: 'AIzaSyD5_k-oAl-WZNaDGey4k3U9_noryurZjKo'
            },
            body: {
                "startDate": startDate,
                "endDate": endDate,
                //"rowLimit": 5, // Max 5000 default 1000
                "dimensions": [
                    "query"
                ]
            }
        })
            .then(
                response => this.convertData(response.result.rows),
                reason => alert('Error: ' + reason.result.error.message)
            );
    }

    create(name: string, keywords: string, siteUrl: string, csv: string): Promise<any> {
        return this.http
            .post(this.dataUrl, {name, keywords, siteUrl, csv}, { headers: this.headers })
            .toPromise()
            .then(response => response.text())
            .catch(this.handleError);
    }

    update(id: number, name: string, siteUrl: string, keywords: string, csv: string): Promise<any> {
        return this.http
            .put(this.dataUrl + '?id=' + id, {name, siteUrl, keywords, csv}, { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    delete(id: number): Promise<any> {
        return this.http
            .delete(this.dataUrl + '?id=' + id, { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    logout(): Promise<any> {
        return this.http.post(location.protocol + '//' + location.hostname + '/' + this.logoutUrl, { logout: window['xsrfToken'] })
            .toPromise()
            .then(function () {
                window.location.href = 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=' + window.location.href;
            });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}