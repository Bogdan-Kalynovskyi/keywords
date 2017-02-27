import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { Report } from '../models/report';
import { ReportService } from '../services/report.service';

import { InputDataRow } from '../models/input-data-row';
import { InputDataService } from '../services/input-data.service';

@Component({
    selector: 'app-ctr-stats',
    templateUrl: './ctr-stats.component.html',
    styleUrls: ['./ctr-stats.component.css'],
    providers: [ReportService, InputDataService]
})

export class CtrStatsComponent implements OnInit {
    @Input()
    report: Report;
    report_data_all_queries: InputDataRow[];
    report_data_non_branded: InputDataRow[];
    all_queries_traffic_loss: number = 0;
    all_queries_traffic_gain: number = 0;
    non_branded_traffic_loss: number = 0;
    non_branded_traffic_gain: number = 0;
    positions: number[] = [];
    positions_stats = [];
    grand_total = {};
    position_stats_limited = [];
    position_stats_resulted = [];
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

        for (var i = 0; i < 1000; i++) {
            this.positions_stats.push({
                position: 0,
                row_indexes: [],
                instances: 0,
                clicks_sum: 0,
                impressions_sum: 0,
                //expected_ctr_sum: 0,
                expected_ctr_avg: 0,
                ctr_calculated_sum: 0,
                ctr_calculated_count: 0,
                ctr_calculated: 0
            });
        }

        this.report_data_non_branded.forEach((row, i , arr) => {

            var sum = 0;
            var count = 0;

            row.instance = arr.reduce(function(total,x){return x.position === row.position ? total+1 : total}, 0);
            for (var item of arr) {
                if (item.position === row.position) {
                    sum += item.inputted_ctr;
                    count ++;
                }
            }
            row.expected_ctr = parseFloat((sum/count).toFixed(2));
            row.ctr_delta = row.inputted_ctr - row.expected_ctr;
            row.expected_clicks = row.expected_ctr*row.impression;
            row.traffic_loss = ((row.click - row.expected_clicks) > 0) ? 0 : parseFloat((row.click - row.expected_clicks).toFixed(2));
            row.traffic_gain = ((row.click - row.expected_clicks) < 0) ? 0 : parseFloat((row.click - row.expected_clicks).toFixed(2));

            this.non_branded_traffic_loss += row.traffic_loss;
            this.non_branded_traffic_gain += row.traffic_gain;

            this.positions.forEach((pos, j , arr1) => {
                if ((j + 1 <= row.position) && (row.position < j + 2)) arr1[j]++;
            });

            this.positions_stats.forEach((pos, j , arr1) => {
                arr1[j].position = (j + 10)/10;
                if (((j + 10)/10 <= row.position) && (row.position < (j + 11)/10)) {
                    arr1[j].row_indexes.push(row.id);
                    arr1[j].instances = row.instance;
                    arr1[j].clicks_sum += row.click;
                    arr1[j].impressions_sum += row.impression;
                    //console.log((j + 10)/10 + '   ' + row.expected_ctr);
                    if (row.expected_ctr != 0) arr1[j].expected_ctr_avg = row.expected_ctr;
                    //console.log(arr1[j]);
                    //arr1[j].expected_ctr_sum += row.expected_ctr;
                };
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

        this.position_stats_limited = this.positions_stats.slice(0, 91);

        for (var i = 0; i <= 10; i++) {
            var tmp = [];
            tmp = this.position_stats_limited.filter(row => row.position.toFixed(0) == i);
            var sum = 0;
            var count = 0;
            tmp.forEach((row, i , arr) => {
                if (row.expected_ctr_avg != 0) {
                    sum += row.expected_ctr_avg;
                    count++;
                }
                //console.log(row);

            });

            tmp.forEach((row, i , arr) => {
                if (row.expected_ctr_avg == 0) {
                    row.ctr_calculated = (count != 0) ? sum/count : 0;
                } else {
                    row.ctr_calculated = row.expected_ctr_avg;
                }
            });

            this.position_stats_resulted = this.position_stats_resulted.concat(tmp);

            //console.log(tmp);
        }

        this.positions_stats = this.positions_stats.filter(row => row.row_indexes.length != 0);

        this.grand_total = {
            instances_sum: this.positions_stats.reduce((a, b) => a + b.instances, 0),
            clicks_sum_sum: this.positions_stats.reduce((a, b) => a + b.clicks_sum, 0),
            impressions_sum_sum: this.positions_stats.reduce((a, b) => a + b.impressions_sum, 0),
            expected_ctr_avg: this.positions_stats.reduce((a, b) => a + b.expected_ctr_avg/b.row_indexes.length, 0)/this.positions_stats.length
        };

        this.top_traffic_gain = this.report_data_non_branded.sort((a, b) => b.traffic_gain - a.traffic_gain).slice(0, 9);
        this.sum_top_traffic_gain = this.top_traffic_gain.reduce((a, b) => a + b.traffic_gain, 0);

        this.top_traffic_loss = this.report_data_non_branded.sort((a, b) => a.traffic_loss - b.traffic_loss).slice(0, 9);
        this.sum_top_traffic_loss = this.top_traffic_loss.reduce((a, b) => a + b.traffic_loss, 0);
    }

}