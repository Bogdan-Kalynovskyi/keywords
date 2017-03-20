import { Component, Input, OnInit, Pipe } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { Report } from '../models/report';
import { ReportService } from '../services/report.service';

import { InputDataRow } from '../models/input-data-row';

@Pipe({name: 'round'})
export class RoundPipe {
    transform (input:number) {
        return Math.round(input);
    }
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [ReportService]
})
export class DashboardComponent implements OnInit {
    @Input()
    report: Report;
    reportId: number;
    file = '';
    private data: InputDataRow[];
    private filteredData: InputDataRow[];
    private allQueriesData: InputDataRow[];
    private nonBrandedData: InputDataRow[];
    private isOwner: boolean;

    private all_queries_traffic_loss: number;
    private all_queries_traffic_gain: number;
    private non_branded_traffic_loss: number;
    private non_branded_traffic_gain: number;
    private positions: number[] = [];
    private positions_stats = [];
    private grand_total = {};
    private positions_stats_limited = [];
    private positions_stats_resulted = [];
    private top_traffic_gain: InputDataRow[];
    private sum_top_traffic_gain: number;
    private top_traffic_loss: InputDataRow[];
    private sum_top_traffic_loss: number;
    private top_ctr_statistics = [];
    private non_branded_keywords = [];

    private tablesSort;

    private google;
    private brandedDataTable;
    private nonBrandedDataTable;

    constructor(
        private reportService: ReportService,
        private route: ActivatedRoute
    ) {
        this.google = window['google'];
        this.google.charts.load('current', {'packages':['corechart']});
    }

    setSort(table: string, col: string, ev) {
        alert('Sort');
    }

    drawChart() {
        let nonBrandedChartOptions =  {
            title: 'Non Branded queries',
            pieHole: 0.5,
            width: 800,
            height: 500
        };

        let brandedChartOptions =  {
            title: 'Branded queries',
            pieHole: 0.5,
            width: 800,
            height: 500
        };

        let data, chart;
            data = this.google.visualization.arrayToDataTable(this.nonBrandedDataTable);
            chart = new this.google.visualization.PieChart(document.getElementById('chartNonBranded'));
            chart.draw(data, nonBrandedChartOptions);

            data = this.google.visualization.arrayToDataTable(this.brandedDataTable);
            chart = new this.google.visualization.PieChart(document.getElementById('chartBranded'));
            chart.draw(data, brandedChartOptions);
    }

    ngOnInit() {
        if (this.route.snapshot.params['id']) {
            this.route.params.switchMap((params: Params) => {
                this.reportId = params['id'];
                return this.reportService.getReport(+this.reportId);
            })
            .subscribe(reportData => {
                if (reportData) {
                    this.data = reportData.csv;
                    this.isOwner = reportData.isOwner == '1';
                    this.report = {
                        id: this.reportId,
                        name: reportData.name,
                        keywords: reportData.keywords
                    };

                    this.dataCalculate(this.data, this.report.keywords);
                }
            });
        }
    }

    dataCalculate(
        data: InputDataRow[],
        reportKeywords: string
    ) {
        this.filteredData = [];

        data.forEach(data => {
            if (data.clicks > 5) {
                this.filteredData.push(Object.assign({}, data));
            }
        });

        this.allQueriesData = [];
        this.filteredData.forEach(data => {
            this.allQueriesData.push(Object.assign({}, data));
        });

        this.allQueriesData.forEach((row, i , arr) => {

            row.calculatedCtr = (row.impressions != 0) ? row.clicks / row.impressions : 0;
            row.instance = arr.reduce(function (total, x) {
                return x.position === row.position ? total + 1 : total
            }, 0);
        });

        this.all_queries_traffic_loss = 0;
        this.all_queries_traffic_gain = 0;

        this.allQueriesData.forEach((row, i , arr) => {
            let sum = 0;
            let count = 0;

            for (let item of arr) {
                if (item.position == row.position) {
                    sum += item.calculatedCtr;
                    count ++;
                }
            }
            row.expected_ctr = sum / count;
            row.ctr_delta = row.calculatedCtr - row.expected_ctr;
            row.expected_clicks = row.expected_ctr*row.impressions;
            row.traffic_loss = row.clicks - row.expected_clicks;

            if (row.traffic_loss > 0) {
                row.traffic_gain = row.traffic_loss;
                row.traffic_loss = 0;
            } else {
                row.traffic_gain = 0;
            }

            this.all_queries_traffic_loss += row.traffic_loss;
            this.all_queries_traffic_gain += row.traffic_gain;

            row.nr = [];
        });

        this.nonBrandedData = [];
        let keywords = reportKeywords.split(',').map(str => str.trim());

        this.allQueriesData.forEach(data => {
            if (keywords.indexOf(data.queries) === -1) {
                this.nonBrandedData.push(Object.assign({}, data));
            }
        });

        for (let i = 0; i < 10; i++) {
            this.positions.push(0);
        }

        this.positions_stats = [];
        for (let i = 0; i < 991; i++) {
            this.positions_stats.push({
                position: 0,
                row_indexes: [],
                instances: 0,
                clicks_sum: 0,
                impressions_sum: 0,
                expected_ctr_sum: 0,
                expected_ctr_avg: 0,
                ctr_calculated_sum: 0,
                ctr_calculated_count: 0,
                ctr_calculated: 0
            });
        }

        this.non_branded_traffic_loss = 0;
        this.non_branded_traffic_gain = 0;

        let sum_clicks = 0;

        this.nonBrandedData.forEach((row, i, arr) => {
            let sum_ctr = 0;
            let count = 0;

            row.instance = arr.reduce(function (total, x) {
                return x.position === row.position ? total + 1 : total
            }, 0);

            for (let item of arr) {
                if (item.position === row.position) {
                    sum_ctr += item.ctr;
                    count++;
                }
            }
            row.expected_ctr = sum_ctr / count;
            row.ctr_delta = row.ctr - row.expected_ctr;
            row.expected_clicks = row.expected_ctr*row.impressions;

            row.traffic_loss = row.clicks - row.expected_clicks;

            if (row.traffic_loss > 0) {
                row.traffic_gain = row.traffic_loss;
                row.traffic_loss = 0;
            } else {
                row.traffic_gain = 0;
            }

            this.non_branded_traffic_loss += row.traffic_loss;
            this.non_branded_traffic_gain += row.traffic_gain;

            this.positions.forEach((pos, j, arr1) => {
                if ((j + 1 <= row.position) && (row.position < j + 2)) arr1[j]++;
            });

            this.positions_stats.forEach((pos, j, arr1) => {
                arr1[j].position = (j + 10) / 10;
                if (((j + 10) / 10 <= row.position) && (row.position < (j + 11) / 10)) {
                    arr1[j].row_indexes.push(row.queries);
                    arr1[j].instances = row.instance;
                    arr1[j].clicks_sum += row.clicks;
                    arr1[j].impressions_sum += row.impressions;
                    arr1[j].expected_ctr_sum += row.expected_ctr;
                    if (row.expected_ctr != 0) arr1[j].expected_ctr_avg = row.expected_ctr;
                }
            });

            row.nr = [];

            sum_clicks += row.clicks;

        });

        this.positions_stats.forEach((pos) => {
            if (pos.row_indexes.length != 0) {
                pos.expected_ctr_avg = pos.expected_ctr_sum / pos.row_indexes.length;
            }
        });

        this.positions_stats_limited = [];
        this.positions_stats.forEach((data) => {
            if (data.position <= 10) { this.positions_stats_limited.push(Object.assign({}, data)); }
        });

        this.positions_stats_resulted = [];

        for (let i = 0; i <= 10; i++) {
            let tmp = [];
            this.positions_stats_limited.forEach(data => {
                if (data.position.toFixed(0) == i) {tmp.push(Object.assign({}, data))}
            });
            let sum = 0;
            let count = 0;
            tmp.forEach((row) => {
                if (row.expected_ctr_avg != 0) {
                    sum += row.expected_ctr_avg;
                    count++;
                }
            });

            tmp.forEach((row) => {
                if (row.expected_ctr_avg == 0) {
                    row.ctr_calculated = (count != 0) ? sum / count : 0;
                } else {
                    row.ctr_calculated = row.expected_ctr_avg;
                }
            });

            tmp.forEach((data) => {
                this.positions_stats_resulted.push(Object.assign({}, {
                    position: data.position,
                    expected_ctr_avg: data.expected_ctr_avg,
                    ctr_calculated: data.ctr_calculated
                }));
            });
        }

        this.positions_stats = this.positions_stats.filter(row => row.row_indexes.length != 0);

        this.grand_total = {
            instances_sum: this.positions_stats.reduce((a, b) => a + b.instances, 0),
            clicks_sum_sum: this.positions_stats.reduce((a, b) => a + b.clicks_sum, 0),
            impressions_sum_sum: this.positions_stats.reduce((a, b) => a + b.impressions_sum, 0),
            expected_ctr_avg: this.positions_stats.reduce((a, b) => a + b.expected_ctr_avg, 0) / this.positions_stats.length
        };

        this.top_traffic_gain = this.nonBrandedData.sort((a, b) => b.traffic_gain - a.traffic_gain).slice(0, 10);
        this.sum_top_traffic_gain = this.top_traffic_gain.reduce((a, b) => a + b.traffic_gain, 0);

        this.top_traffic_loss = this.nonBrandedData.sort((a, b) => a.traffic_loss - b.traffic_loss).slice(0, 10);
        this.sum_top_traffic_loss = this.top_traffic_loss.reduce((a, b) => a + b.traffic_loss, 0);

        let tmp;

        this.allQueriesData.forEach((row) => {
            for (let j = 1; j < 11; j++) {
                if ( row.position < j + 1 ) {
                    row.nr.push(0);
                }
                else {
                    tmp = this.positions_stats_resulted.find(data => data.position == j);
                    row.nr.push(row.impressions * tmp.ctr_calculated + row.ctr_delta);
                }
            }
            if ( row.position < 2 ) {
                row.nr.push(0);
            }
            else {
                if (row.position <= 10) {
                    tmp = this.positions_stats_resulted.find(data => Math.round((row.position - 1 - data.position) * 100) == 0);
                } else {
                    tmp = this.positions_stats_resulted.find(data => data.position == 10);
                }
                row.nr.push(row.impressions * tmp.ctr_calculated + row.ctr_delta);
            }
        });

        this.nonBrandedData.forEach((row) => {
            for (let j = 1; j < 11; j++) {
                if ( row.position < j + 1 ) {
                    row.nr.push(0);
                }
                else {
                    tmp = this.positions_stats_resulted.find(data => data.position == j);
                    row.nr.push(row.impressions * tmp.ctr_calculated + row.ctr_delta);
                }
            }
            if ( row.position < 2 ) {
                row.nr.push(0);
            }
            else {
                if (row.position <= 10) {
                    tmp = this.positions_stats_resulted.find(data => Math.round((row.position - 1 - data.position) * 100) == 0);
                } else {
                    tmp = this.positions_stats_resulted.find(data => data.position == 10);
                }
                row.nr.push(row.impressions * tmp.ctr_calculated + row.ctr_delta);
            }
        });

        this.top_ctr_statistics = [];
        this.positions_stats_resulted.forEach(data => {
            if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].indexOf(data.position) != -1) {
                this.top_ctr_statistics.push(Object.assign({}, {
                    position: data.position,
                    ctr_calculated: data.ctr_calculated
                }));
            }
        });

        this.non_branded_keywords = [];
        for (let i = 0, clicks; i < 11; i++) {
            clicks = this.nonBrandedData.reduce((a, b) => a + b.nr[i], 0);
            this.non_branded_keywords.push({
                position: ( i != 10 ) ? '#' + (i + 1).toString() : '1+',
                clicks: clicks,
                difference: (clicks - sum_clicks) / sum_clicks
            });
        }

        this.brandedDataTable = [
            ['Category', 'Value'],
            ['Traffic Loss', Math.abs(this.all_queries_traffic_loss)],
            ['Traffic Gain', this.all_queries_traffic_gain]
        ];

        this.nonBrandedDataTable = [
            ['Category', 'Value'],
            ['Traffic Loss', Math.abs(this.non_branded_traffic_loss)],
            ['Traffic Gain', this.non_branded_traffic_gain]
        ];

        this.google.charts.setOnLoadCallback(() => this.drawChart());
    };

    onDataChange(){
        this.dataCalculate(this.data, this.report.keywords);
    }


    onFileChange(ev){
        let reader = new FileReader();
        reader.onload = (theFile =>
                e => {
                    this.file = e.target.result;
                    this.data = this.reportService.parseCsv(e.target.result) as InputDataRow[];
                    this.onDataChange();
                }
        )(ev.target.files[0]);

        reader.readAsText(ev.target.files[0]);
    }


    updateData() {
        this.reportService.update(this.report.id, this.report.name, this.report.keywords, this.file)
            .then(() => {
                location.reload();
            }
        );
    };
}