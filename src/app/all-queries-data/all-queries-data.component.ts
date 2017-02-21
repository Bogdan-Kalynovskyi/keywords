import { Component, OnInit } from '@angular/core';

import { AllQueriesDataRow } from '../models/all-queries-data-row';

@Component({
    selector: 'app-all-queries-data',
    templateUrl: 'all-queries-data.component.html',
    styleUrls: ['all-queries-data.component.css']
})
export class AllQueriesDataComponent implements OnInit {
    data_rows: AllQueriesDataRow[];

    constructor() {

    }

    ngOnInit(): void {
        this.data_rows = [];
    }

    // getInputDataRows() {
    //     return this.inputDataService.getInputDataRows().then(input_data_rows => {
    //         this.input_data_rows = input_data_rows;
    //         this.dataCalculations();
    //     });
    // }
    //
    // dataCalculations() {
    //     this.input_data_rows.forEach(function(row, i , arr) {
    //         var sum = 0;
    //         var count = 0;
    //         row.ctr = row.impression ? row.click/row.impression : 0;
    //         row.instance = arr.reduce(function(total,x){return x.position === row.position ? total+1 : total}, 0);
    //         for (var item of arr) {
    //             if (item.position === row.position) {
    //                 sum += item.ctr;
    //                 count ++;
    //             }
    //         }
    //         row.expected_ctr = sum/count;
    //         row.ctr_delta = row.ctr - row.expected_ctr;
    //         row.expected_clicks = row.expected_ctr*row.impression;
    //         row.traffic_loss = (row.click - row.expected_clicks > 0) ? 0 : row.click - row.expected_clicks;
    //         row.traffic_gain = (row.click - row.expected_clicks < 0) ? 0 : row.click - row.expected_clicks;
    //         row.nr1 = 3;
    //         row.nr2 = 3;
    //         row.nr3 = 3;
    //         row.nr4 = 3;
    //         row.nr5 = 3;
    //         row.nr6 = 3;
    //         row.nr7 = 3;
    //         row.nr8 = 3;
    //         row.nr9 = 3;
    //         row.nr10 = 3;
    //         row.nr11 = 3;
    //     });
    // }

}