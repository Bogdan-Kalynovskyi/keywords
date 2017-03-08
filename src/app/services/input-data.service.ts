import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {InputDataRow} from '../models/input-data-row';

@Injectable()
export class InputDataService {

    private loadDataPromise;
    // private data: InputDataRow[];
    private dataUrl = 'http://localhost/api/report.php';

    constructor(private http: Http) {
    }

    // getInputDataRows() {
    //     return this.data;
    // }
}
