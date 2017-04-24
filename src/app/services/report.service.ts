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
    private urlPrefix = location.protocol + '//' + location.hostname + '/';
    private reportUrl = this.urlPrefix + 'api/reports.php';
    private userUrl = this.urlPrefix + 'api/users.php';
    private logoutUrl = 'api/login.php';
    private headers = new Headers({ Authorization: window['xsrfToken'] });

    constructor(private http: Http) { }

    getReports(): Promise<Report[]> {
        return this.http
            .get(this.reportUrl, { headers: this.headers })
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
            .get(this.reportUrl + '?id=' + id, { headers: this.headers })
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

    convertDataToInputDataRow(data) {
        for (let i = 0; i < data.length; i++) {
            data[i]['queries'] = data[i]['keys'][0];
            if (data[i]['keys'].length > 1) {alert('ooops');}
            data[i]['clicks'] = Math.round(parseFloat(data[i]['clicks'])/3);
            data[i]['impressions'] = Math.round(parseFloat(data[i]['impressions'])/3);
            data[i]['ctr'] = Math.round((parseFloat(data[i]['ctr'])/3)*100)/100;
            data[i]['position'] = Math.round((parseFloat(data[i]['position'])/3)*10)/10;
            delete data[i]['keys'];
        }

        return data;
    }

    convertDataToCsv(data): string {
        let str = 'Queries,Clicks,Impressions,CTR,Position\n';

        for (let i = 0; i < data.length; i++) {
            let row = data[i],
                q = row.queries;

            if (q.search(/("|,|\n)/g) >= 0) {
                q = '"' + q + '"';
            }
            str += q + ','
                + row.clicks + ','
                + row.impressions + ','
                + row.ctr + '%,'
                + row.position + '\n';
        }

        return str.substr(0, str.length-1);
    }

    //getUser

    setUserCode(code) {
        return this.http
            .put(this.userUrl, {code: code}, { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    private leadingZero(number:Number) {
        return (number < 10) ? '0' + number : number;
    }

    private getGoogleFormattedDate(date:Date) {
        return date.getFullYear() + '-' + this.leadingZero(date.getMonth() + 1) + '-' + this.leadingZero(date.getDate());
    }

    getGoogleData(siteUrl): Promise<any> {
        let gapi;
        gapi = window['gapi'];

        let apiKey;
        apiKey = window['apiKey'];

        let date = new Date();
        date.setDate(date.getDate() - 2);
        let endDate = this.getGoogleFormattedDate(date);
        date.setDate(date.getDate() - 90); // note we already did -2 above
        let startDate = this.getGoogleFormattedDate(date);

        return gapi.client.request({
            path: 'https://www.googleapis.com/webmasters/v3/sites/'+ encodeURIComponent(siteUrl) + '/searchAnalytics/query',
            method: 'POST',
            params: {
                key: apiKey
            },
            body: {
                "startDate": startDate,
                "endDate": endDate,
                "rowLimit": 5000, // Max 5000 default 1000
                "dimensions": [
                    "query"
                ]
            }
        })
            .then(
                response => {
                    let inputDataRow = this.convertDataToInputDataRow(response.result.rows);
                    return {
                        csv: this.convertDataToCsv(inputDataRow),
                        inputDataRow: inputDataRow
                    }
                },
                reason => alert('Error: ' + reason.result.error.message)
            );
    }

    create(name: string, keywords: string, siteUrl: string, csv: string): Promise<any> {
        return this.http
            .post(this.reportUrl, {name, keywords, siteUrl, csv}, { headers: this.headers })
            .toPromise()
            .then(response => response.text())
            .catch(this.handleError);
    }

    update(id: number, name: string, siteUrl: string, keywords: string, csv: string): Promise<any> {
        return this.http
            .put(this.reportUrl + '?id=' + id, {name, siteUrl, keywords, csv}, { headers: this.headers })
            .toPromise()
            .catch(this.handleError);
    }

    delete(id: number): Promise<any> {
        return this.http
            .delete(this.reportUrl + '?id=' + id, { headers: this.headers })
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
        console.error('An error occurred', error); // TODO aler message
        return Promise.reject(error.message || error);
    }

}