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
    private data: InputDataRow[];
    private filteredData: InputDataRow[];
    private allQueriesData: InputDataRow[];
    private nonBrandedData: InputDataRow[];

    all_queries_traffic_loss: number;
    all_queries_traffic_gain: number;
    non_branded_traffic_loss: number;
    non_branded_traffic_gain: number;
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
        private route: ActivatedRoute
    ) { }

    nonBrandedChartOptions =  {
        chartType: 'PieChart',
        dataTable: [],
        options: {
            'title': 'Non Branded queries',
            'pieHole': 0.5,
            'pieSliceTextStyle' : {
                'color': 'black',
            },
            'width': 800,
            'height': 500
        },
    };

    brandedChartOptions =  {
        chartType: 'PieChart',
        dataTable: [],
        options: {
            'title': 'Branded queries',
            'pieHole': 0.5,
            'pieSliceTextStyle' : {
                'color': 'black',
            },
            'width': 800,
            'height': 500
        },
    };

    ngOnInit() {
        this.route.params.switchMap((params: Params) => {
            this.reportId = params['id'];
            return this.reportService.getReport(+this.reportId);
        })
            .subscribe(reportData => {
                if (reportData) {
                    this.data = reportData.csv;
                    this.report = {
                        id: this.reportId,
                        name: reportData.name,
                        keywords: reportData.keywords
                    };
                    this.dataCalculate(this.data, this.report.keywords);
                }
            });
    }

    dataCalculate(
        data: InputDataRow[],
        reportKeywords: string
    ) {
        this.all_queries_traffic_loss = 0;
        this.all_queries_traffic_gain = 0;
        this.non_branded_traffic_loss = 0;
        this.non_branded_traffic_gain = 0;

        this.filteredData = [];

        data.forEach(data => {
            if (data.clicks >= 5) {
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

        this.allQueriesData.forEach((row, i , arr) => {
            var sum = 0;
            var count = 0;

            for (var item of arr) {
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
        });

        this.nonBrandedData = [];
        this.allQueriesData.forEach(data => {
            if (reportKeywords.split(",").indexOf(data.queries) == -1) {
                this.nonBrandedData.push(Object.assign({}, data));
            }
        });

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

        //ToDo
        this.brandedChartOptions.dataTable = [];
        this.brandedChartOptions.dataTable.push(['Category', 'Value']);
        this.brandedChartOptions.dataTable.push(['Traffic Loss', ((-1) * this.all_queries_traffic_loss)]);
        this.brandedChartOptions.dataTable.push(['Traffic Gain', this.all_queries_traffic_gain]);

        this.nonBrandedData.forEach((row, i, arr) => {

            var sum = 0;
            var count = 0;

            row.instance = arr.reduce(function (total, x) {
                return x.position === row.position ? total + 1 : total
            }, 0);
            for (var item of arr) {
                if (item.position === row.position) {
                    sum += item.ctr;
                    count++;
                }
            }
            row.expected_ctr = sum / count;
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
                    arr1[j].row_indexes.push(row.id);
                    arr1[j].instances = row.instance;
                    arr1[j].clicks_sum += row.clicks;
                    arr1[j].impressions_sum += row.impressions;
                    if (row.expected_ctr != 0) arr1[j].expected_ctr_avg = row.expected_ctr;
                }
            });
        });

        this.nonBrandedChartOptions.dataTable = [];
        this.nonBrandedChartOptions.dataTable.push(['Category', 'Value']);
        this.nonBrandedChartOptions.dataTable.push(['Traffic Loss', (-1) * this.non_branded_traffic_loss]);
        this.nonBrandedChartOptions.dataTable.push(['Traffic Gain', this.non_branded_traffic_gain]);

        this.position_stats_limited = [];
        this.positions_stats.forEach((data, i) => {
            if (i < 92) {this.position_stats_limited.push(Object.assign({}, data))};
        });

        for (var i = 0; i <= 10; i++) {
            var tmp = [];
            this.position_stats_limited.forEach(data => {
                if (data.position.toFixed(0) == i) {tmp.push(Object.assign({}, data))}
            })
            var sum = 0;
            var count = 0;
            tmp.forEach((row, i, arr) => {
                if (row.expected_ctr_avg != 0) {
                    sum += row.expected_ctr_avg;
                    count++;
                }
            });

            tmp.forEach((row, i, arr) => {
                if (row.expected_ctr_avg == 0) {
                    row.ctr_calculated = (count != 0) ? sum / count : 0;
                } else {
                    row.ctr_calculated = row.expected_ctr_avg;
                }
            });

            this.position_stats_resulted = [];
            tmp.forEach((data, i) => {
                this.position_stats_resulted.push(Object.assign({}, data));
            });
        }

        this.positions_stats = this.positions_stats.filter(row => row.row_indexes.length != 0).slice();

        this.grand_total = {
            instances_sum: this.positions_stats.reduce((a, b) => a + b.instances, 0),
            clicks_sum_sum: this.positions_stats.reduce((a, b) => a + b.clicks_sum, 0),
            impressions_sum_sum: this.positions_stats.reduce((a, b) => a + b.impressions_sum, 0),
            expected_ctr_avg: this.positions_stats.reduce((a, b) => a + b.expected_ctr_avg / b.row_indexes.length, 0) / this.positions_stats.length
        };

        this.top_traffic_gain = this.nonBrandedData.sort((a, b) => b.traffic_gain - a.traffic_gain).slice(0, 9);
        this.sum_top_traffic_gain = this.top_traffic_gain.reduce((a, b) => a + b.traffic_gain, 0);

        this.top_traffic_loss = this.nonBrandedData.sort((a, b) => a.traffic_loss - b.traffic_loss).slice(0, 9);
        this.sum_top_traffic_loss = this.top_traffic_loss.reduce((a, b) => a + b.traffic_loss, 0);

    };

    onFileChange(ev){

        let reader = new FileReader();
        reader.onload = (theFile =>
                e => {
                    this.data = this.reportService.parseCsv(e.target.result) as InputDataRow[];
                    this.dataCalculate(this.data, this.report.keywords);
                }
        )(ev.target.files[0]);

        reader.readAsText(ev.target.files[0]);
    }

    updateData(file: string) {
        debugger;
        this.reportService.update(this.report.id, this.report.name, this.report.keywords, file);
            //.then(report => {
               // this.dataCalculate(this.inputDataService.parseCsv(file) as InputDataRow[], report.keywords);
              //  return report;
            //}
        //);
        this.dataCalculate(this.reportService.parseCsv(file) as InputDataRow[], this.report.keywords);
    };
}