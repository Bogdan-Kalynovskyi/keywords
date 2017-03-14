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
    private dataUrl = 'http://localhost/api/reports.php';
    private logoutUrl = 'http://localhost/api/logout.php';
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
            var x = arrData[i];
            result.push({
                queries: x[0],
                clicks: +x[1],
                impressions: +x[2],
                ctr: parseFloat(x[3]) / 100,
                position: +x[4]
            });
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

    logout(): Promise<any> {debugger;
        return Promise.all([
            this.http.post(this.logoutUrl, { logout: window['xsrfToken'] }),
            window['gapi'].auth2.getAuthInstance().signOut()
        ])
        .then(function () {
            window.location.reload();
        });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}