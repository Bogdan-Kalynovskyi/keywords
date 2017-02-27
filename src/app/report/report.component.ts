import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { Report } from '../models/report';
import { ReportService } from '../services/report.service';

import { InputDataRow } from '../models/input-data-row';
import { InputDataService } from '../services/input-data.service';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css'],
    providers: [ReportService, InputDataService]
})

export class ReportComponent implements OnInit {
    @Input()
    report: Report;
    report_data_all_queries: InputDataRow[];
    report_data_non_branded: InputDataRow[];
    all_queries_traffic_loss: number = 0;
    all_queries_traffic_gain: number = 0;
    non_branded_traffic_loss: number = 0;
    non_branded_traffic_gain: number = 0;
    positions: number[] = [];
    top_traffic_gain: InputDataRow[];
    sum_top_traffic_gain: number;
    top_traffic_loss: InputDataRow[];
    sum_top_traffic_loss: number;

    constructor(
        private reportService: ReportService,
        private inputDataService: InputDataService,
        private route: ActivatedRoute,
        private location: Location
    ) {

    }

    ngOnInit(): void {
        // this.route.params.switchMap((params: Params) =>
        //     this.reportService.getReport(+params['id'])).subscribe(report => this.report = report);
        //
        // this.route.params.switchMap((params: Params) =>
        //     this.inputDataService.loadData(+params['id'])).subscribe(report_data => {
        //     this.report_data_all_queries = report_data.filter(row_data => row_data.click >= 5);
        //     this.dataCalculations1();
        // });
        //
        // this.route.params.switchMap((params: Params) =>
        //     this.inputDataService.loadData(+params['id'])).subscribe(report_data => {
        //     this.report_data_non_branded = report_data.filter(row_data => row_data.click >= 5 && this.report.keywords.split(",").indexOf(row_data.query) == -1);
        //     this.dataCalculations2();
        // });

    }

    dataCalculations1() {
        this.report_data_all_queries.forEach((row, i , arr) => {

            var sum = 0;
            var count = 0;
            row.ctr = (row.impression != 0) ? parseFloat((row.click/row.impression).toFixed(2)) : 0;
            row.instance = arr.reduce(function(total,x){return x.position === row.position ? total+1 : total}, 0);
            for (var item of arr) {
                if (item.position === row.position) {
                    sum += item.ctr;
                    count ++;
                }
            }
            row.expected_ctr = parseFloat((sum/count).toFixed(2));
            row.ctr_delta = row.ctr - row.expected_ctr;
            row.expected_clicks = row.expected_ctr*row.impression;
            row.traffic_loss = ((row.click - row.expected_clicks) > 0) ? 0 : parseFloat((row.click - row.expected_clicks).toFixed(2));
            row.traffic_gain = ((row.click - row.expected_clicks) < 0) ? 0 : parseFloat((row.click - row.expected_clicks).toFixed(2));

            this.all_queries_traffic_loss += row.traffic_loss;
            this.all_queries_traffic_gain += row.traffic_gain;

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

    dataCalculations2() {
        for (var i = 0; i < 10; i++) {
            this.positions.push(0);
        }

        this.report_data_non_branded.forEach((row, i , arr) => {

            var sum = 0;
            var count = 0;

            row.instance = arr.reduce(function(total,x){return x.position === row.position ? total+1 : total}, 0);
            for (var item of arr) {
                if (item.position === row.position) {
                    sum += item.inputed_ctr;
                    count ++;
                }
            }
            row.expected_ctr = parseFloat((sum/count).toFixed(2));
            row.ctr_delta = row.inputed_ctr - row.expected_ctr;
            row.expected_clicks = row.expected_ctr*row.impression;
            row.traffic_loss = ((row.click - row.expected_clicks) > 0) ? 0 : parseFloat((row.click - row.expected_clicks).toFixed(2));
            row.traffic_gain = ((row.click - row.expected_clicks) < 0) ? 0 : parseFloat((row.click - row.expected_clicks).toFixed(2));

            this.non_branded_traffic_loss += row.traffic_loss;
            this.non_branded_traffic_gain += row.traffic_gain;

            this.positions.forEach((pos, j , arr1) => {
                if ((j + 1 <= row.position) && (row.position < j + 2)) arr1[j]++;
            });

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

        this.top_traffic_gain = this.report_data_non_branded.sort((a, b) => b.traffic_gain - a.traffic_gain).slice(0, 9);
        this.sum_top_traffic_gain = this.top_traffic_gain.reduce((a, b) => a + b.traffic_gain, 0);

        this.top_traffic_loss = this.report_data_non_branded.sort((a, b) => a.traffic_loss - b.traffic_loss).slice(0, 9);
        this.sum_top_traffic_loss = this.top_traffic_loss.reduce((a, b) => a + b.traffic_loss, 0);

    }

}
