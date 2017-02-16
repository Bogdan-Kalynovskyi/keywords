import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { InputDataRow } from '../models/input-data-row';
import { InputDataService } from '../services/input-data.service';

@Component({
  selector: 'app-input-data-rows',
  templateUrl: './input-data-rows.component.html',
  styleUrls: ['./input-data-rows.component.css'],
  providers: [InputDataService]
})
export class InputDataRowsComponent implements OnInit {
  selectedRow: InputDataRow;
  input_data_rows: InputDataRow[];

  constructor(
      private inputDataService: InputDataService,
      private router: Router) {

  }

  ngOnInit(): void {
    this.getInputDataRows();
  }

  getInputDataRows(): void {
    this.inputDataService.getInputDataRows().then(input_data_rows =>
        this.input_data_rows = input_data_rows);
  }

  add(query: string): void {
    query = query.trim();
    if (!query) { return; }
    this.inputDataService.create(query)
        .then(input_data_row => {
          this.input_data_rows.push(input_data_row);
          this.selectedRow = null;
        });
  }

  delete(input_data_row: InputDataRow): void {
    this.inputDataService
        .delete(input_data_row.id)
        .then(() => {
          this.input_data_rows = this.input_data_rows.filter(h => h !== input_data_row);
          if (this.selectedRow === input_data_row) {
            this.selectedRow = null;
          }
        });
  }

}