import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { InputDataRow } from '../models/input-data-row';
import { InputDataService } from '../services/input-data.service';

@Component({
    selector: 'app-filtered-data',
    templateUrl: './filtered-data.component.html',
    styleUrls: ['./filtered-data.component.css'],
    providers: [InputDataService]
})
export class FilteredDataComponent implements OnInit {
    @Input()
    report_data: InputDataRow[];

    constructor(
        private inputDataService: InputDataService,
        private route: ActivatedRoute,
        private location: Location
    ) {}

    ngOnInit(): void {
        // this.route.params.switchMap((params: Params) =>
        //     this.inputDataService.loadData(+params['id'])).subscribe(report_data =>
        //     this.report_data = report_data.filter(row_data => row_data.click >= 5)
        // );
        //this.report_data = this.inputDataService.getInputDataRows();
    }
}