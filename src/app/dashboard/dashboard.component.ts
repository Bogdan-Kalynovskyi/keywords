import {Component, Input, OnInit, Pipe, NgZone, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {FormControl} from '@angular/forms';
import {MdDatepickerIntl} from '@angular/material';

import 'rxjs/add/operator/switchMap';

import { Report } from '../models/report';
import { ReportService } from '../services/report.service';

import {InputDataRow, SeoData} from '../models/input-data-row';

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
    providers: [ReportService, MdDatepickerIntl]
})
export class DashboardComponent implements OnInit {
    @Input()
    report: Report;
    reportId: number;
    csvParsedReadyToSave: SeoData;
    submitDisabled = false;
    siteList: string[];
    isApiAllowed: boolean;
    siteCtrl: FormControl;
    filteredSites: any;
    dateFromFilter: any;
    dateToFilter: any;
    dateFromAvailable: any;
    dateToAvailable: any;

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

    private google;
    private brandedDataTable;
    private nonBrandedDataTable;

    constructor(
        private reportService: ReportService,
        private route: ActivatedRoute,
        private _ngZone: NgZone,
        private _changeDetectorRef: ChangeDetectorRef//,
        // private _applicationRef: ApplicationRef
    ) {
        this.isApiAllowed = window['isApiAllowed'];
        this.siteList = window['siteList'];
        this.google = window['google'];
        this.google.charts.load('current', {'packages':['corechart']});
        window['dashboardRef'] = {component: this, zone: _ngZone};

        this.siteCtrl = new FormControl();
        this.filteredSites = this.siteCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterSites(name));
    }

    filterSites(val: string) {
        return val ? this.siteList.filter(s => new RegExp(`${val}`, 'gi').test(s))
            : this.siteList;
    }

    setAllowedApi(status) {
        this.isApiAllowed = status;
    }

    setSitesList(sitesList) {
        this.siteList = sitesList;
    }

    auth() {
        window['auth2Login']();
    }

    resetSorting() {
        let elements = document.getElementsByClassName('asc');
        for (var i = 0; i < elements.length; i++) {
            elements[i].className = '';
        }
        elements = document.getElementsByClassName('desc');
        for (var i = 0; i < elements.length; i++) {
            elements[i].className = '';
        }
    }

    setSort(event, firstField, secondField) {
        let column = event.target;
        let row = column.parentNode;
        let tableName = row.parentNode.parentNode.id;
        let colName = firstField || column.innerHTML.toLowerCase(); //.replace(/[^a-z]/g, '');

        Array.prototype.slice.call(row.children).forEach((col) => {
            if (col === column) {
                let direction;
                if (col.className === 'asc') {
                    col.className = 'desc';
                    direction = 1;
                } else {
                    col.className = 'asc';
                    direction = -1;
                }

                if (secondField) {
                    this[tableName].sort((a, b) => (a[colName][secondField] < b[colName][secondField] ? direction : -direction));
                }
                else {
                    this[tableName].sort((a, b) => (a[colName] < b[colName] ? direction : -direction));
                }

            } else {
                col.className = '';
            }
        });
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

    setTitle(title) {
        document.title = title;
    }

    updateFromDate(newDate) {
        this.dateFromFilter = newDate;
        this.getFilteredData(this.reportId, this.dateFromFilter, this.dateToFilter);
    }

    updateToDate(newDate) {
        this.dateToFilter = newDate;
        this.getFilteredData(this.reportId, this.dateFromFilter, this.dateToFilter);
    }

    getFilteredData(reportId: number, dateFrom?, dateTo? ){
        if (dateFrom) {
            dateFrom.setHours(0, 0, 0);
            dateFrom = dateFrom.getTime() / 1000;
        }
        if (dateTo) {
            dateTo.setHours(23, 59, 59);
            dateTo = dateTo.getTime() / 1000;
        }
        window['showLoader']();
        this.reportService.getSeoData(reportId, dateFrom, dateTo) // note there are start and end time arguments
            .then(data => {
                this.data = data;
                this.dataCalculate(this.data, this.report.keywords);
                this.resetSorting();
                window['hideLoader']();
            });
    }

    ngOnInit() {
        if (this.route.snapshot.params['id']) {
            this.route.params.switchMap((params: Params) => {
                this.reportId = params['id'];
                this.resetSorting();
                window['showLoader']();
                return this.reportService.getReport(+this.reportId);
            })
            .subscribe(reportData => {
                //debugger;
                if (reportData) {
                    this.setTitle(reportData.name);
                    this.isOwner = reportData.isOwner === '1';
                    this.report = {
                        id: this.reportId,
                        name: reportData.name,
                        keywords: reportData.keywords,
                        isGoogle: reportData.isGoogle,
                        siteUrl: reportData.siteUrl
                    };

                    if (reportData.siteUrl) {
                        this.dateFromFilter = new Date(reportData.dateFromAvailable * 1000);
                        this.dateToFilter = new Date(reportData.dateToAvailable * 1000);

                        this.dateFromAvailable = this.dateFromFilter.toLocaleDateString();
                        this.dateToAvailable = this.dateToFilter.toLocaleDateString();

                        let now = new Date(),
                            yesDate = new Date(reportData.yes_date * 1000),
                            dateDiff = (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
                                Date.UTC(yesDate.getFullYear(), yesDate.getMonth(), yesDate.getDate())) / 86400000;
//todo material

                        if (!this.isOwner || (dateDiff > 1 && window['confirm']('Show update?'))) {
                            if (this.isOwner) {
                                this.reportService.changeYesTime(this.reportId);
                            }
                        }
                        else {
                            this.dateToFilter = yesDate;
                        }

                        this.getFilteredData(this.reportId, this.dateFromFilter, this.dateToFilter);

                    }

                    else {
                        this.getFilteredData(this.reportId);
                    }
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
            row.instances = arr.reduce(function (total, x) {
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
            let contain_keyword = false;
            if (reportKeywords != '') {
                keywords.forEach(
                    keyword => {
                        if (data.query.indexOf(keyword) != -1) {
                            contain_keyword = true;
                        }
                    }
                );
            }
            if (!contain_keyword) {
                this.nonBrandedData.push(Object.assign({}, data));
            }

        });

        this.positions = [];
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

            row.instances = arr.reduce(function (total, x) {
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
                    arr1[j].row_indexes.push(row.query);
                    arr1[j].instances = row.instances;
                    arr1[j].clicks_sum += row.clicks;
                    arr1[j].impressions_sum += row.impressions;
                    arr1[j].expected_ctr_sum += row.expected_ctr;
                    if (row.expected_ctr != 0) arr1[j].expected_ctr_avg = row.expected_ctr;
                }
            });

            row.nr = [];

            sum_clicks += row.clicks;

        });

        this.positions_stats.forEach(pos => {
            if (pos.row_indexes.length != 0) {
                pos.expected_ctr_avg = pos.expected_ctr_sum / pos.row_indexes.length;
            }
        });

        this.positions_stats_limited = [];
        this.positions_stats.forEach(data => {
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
            tmp.forEach(row => {
                if (row.expected_ctr_avg != 0) {
                    sum += row.expected_ctr_avg;
                    count++;
                }
            });

            tmp.forEach(row => {
                if (row.expected_ctr_avg == 0) {
                    row.ctr_calculated = (count != 0) ? sum / count : 0;
                } else {
                    row.ctr_calculated = row.expected_ctr_avg;
                }
            });

            tmp.forEach(data => {
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

        this.allQueriesData.forEach(row => {
            for (let j = 1; j < 11; j++) {
                if ( row.position < j + 1 ) {
                    row.nr.push(0);
                }
                else {
                    tmp = this.positions_stats_resulted.find(data => data.position == j);
                    if (tmp) {
                        row.nr.push(row.impressions * tmp.ctr_calculated + row.ctr_delta);
                    }
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
                if (tmp) {
                    row.nr.push(row.impressions * tmp.ctr_calculated + row.ctr_delta);
                }
            }
        });

        this.nonBrandedData.forEach(row => {
            for (let j = 1; j < 11; j++) {
                if ( row.position < j + 1 ) {
                    row.nr.push(0);
                }
                else {
                    tmp = this.positions_stats_resulted.find(data => data.position == j);
                    if (tmp) {
                        row.nr.push(row.impressions * tmp.ctr_calculated + row.ctr_delta);
                    }
                }
            }
            if (row.position < 2) {
                row.nr.push(0);
            }
            else {
                if (row.position <= 10) {
                    tmp = this.positions_stats_resulted.find(data => Math.round((row.position - 1 - data.position) * 100) == 0);
                } else {
                    tmp = this.positions_stats_resulted.find(data => data.position == 10);
                }
                if (tmp) {
                    row.nr.push(row.impressions * tmp.ctr_calculated + row.ctr_delta);
                }
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

        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
            // this._applicationRef.tick();
        }, 100);

        this.google.charts.setOnLoadCallback(() => this.drawChart());
    };


    onDataChange(){
        this.report.keywords = this.report.keywords.toLowerCase();
        this.resetSorting();
        this.dataCalculate(this.data, this.report.keywords);
    }


    onFileChange(ev){
        let reader = new FileReader();
        reader.onload = (theFile =>
            e => {
                [this.data, this.csvParsedReadyToSave] = this.reportService.parseCsv(e.target.result);
                this.onDataChange();
            }
        )(ev.target.files[0]);

        reader.readAsText(ev.target.files[0]);
    }

    testUrl(url) {
        return url && /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
    }

    onUrlChange(site){
        this.report.siteUrl = site;
        this.submitDisabled = true;
        if (this.testUrl(this.report.siteUrl)) {
            window['showLoader']();
            this.reportService.getDataFromGoogleApi(this.report.siteUrl)
                .then(data => {
                    if (data) {
                        this.submitDisabled = false;
                        this.data = data[0] as InputDataRow[];
                        this.csvParsedReadyToSave = data[1];
                        this.onDataChange();
                        window['hideLoader']();
                    }
                });
        } else {
            alert('The site url is not valid');
        }
    }

    updateData() {
        if (this.report.isGoogle == true) {
            if (this.report.siteUrl && !this.testUrl(this.report.siteUrl)) {
                alert('The site url is not valid');
                return 0;
            }
        }
        window['showLoader']();
        this.reportService.update(this.report.id, this.report.name, this.report.siteUrl, this.report.keywords, this.csvParsedReadyToSave)
            .then(() => {
                location.reload();
            });
    }

}