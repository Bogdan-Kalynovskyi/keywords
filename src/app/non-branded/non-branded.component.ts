import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { Report } from '../models/report';
import { ReportService } from '../services/report.service';

import { InputDataRow } from '../models/input-data-row';
import { InputDataService } from '../services/input-data.service';

@Component({
    selector: 'app-non-branded',
    templateUrl: './non-branded.component.html',
    styleUrls: ['./non-branded.component.css'],
    providers: [ReportService, InputDataService]
})
export class NonBrandedComponent implements OnInit {
    @Input()
    report: Report;
    report_data: InputDataRow[];

    constructor(
        private reportService: ReportService,
        private inputDataService: InputDataService,
        private route: ActivatedRoute,
        private location: Location
    ) { }

    ngOnInit() {
        this.route.params.switchMap((params: Params) =>
            this.reportService.getReport(+params['id'])).subscribe(report => this.report = report);

        this.route.params.switchMap((params: Params) =>
            this.inputDataService.loadData(+params['id'])).subscribe(report_data => {
            this.report_data = report_data.filter(row_data => row_data.click >= 5 && this.report.keywords.split(",").indexOf(row_data.query) == -1);
            this.dataCalculations();
        });
    }

    dataCalculations() {

        this.report_data.forEach((row, i , arr) => {

            var sum = 0;
            var count = 0;

            row.ctr = row.impression ? row.click/row.impression : 0;
            row.instance = arr.reduce(function(total,x){return x.position === row.position ? total+1 : total}, 0);
            for (var item of arr) {
                if (item.position === row.position) {
                    sum += item.ctr;
                    count ++;
                }
            }
            row.expected_ctr = sum/count;
            row.ctr_delta = row.ctr - row.expected_ctr;
            row.expected_clicks = row.expected_ctr*row.impression;
            row.traffic_loss = ((row.click - row.expected_clicks) > 0) ? 0 : (row.click - row.expected_clicks);
            row.traffic_gain = ((row.click - row.expected_clicks) < 0) ? 0 : (row.click - row.expected_clicks);
            row.nr1 = 3;
            row.nr2 = 3;
            row.nr3 = 3;
            row.nr4 = 3;
            row.nr5 = 3;
            row.nr6 = 3;
            row.nr7 = 3;
            row.nr8 = 3;
            row.nr9 = 3;
            row.nr10 = 3;
            row.nr11 = 3;
        });
    }

}
