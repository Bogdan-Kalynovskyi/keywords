import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let inputRows = [
      {id: 0, query: 'trolley', click: 261, impression: 12770, ctr: 2.04, position: 2.8},
      {id: 1, query: 'trolleys', click: 167, impression: 4052, ctr: 4.12, position: 3.6},
      {id: 2, query: 'pallet jack', click: 84, impression: 4826, ctr: 1.74, position: 5},
      {id: 3, query: 'stainless steel trolley', click: 65, impression: 552, ctr: 11.78, position: 2.3}
    ];
    let reports = [
      {id: 0, query: 'trolley', click: 261, impression: 12770, ctr: 2.04, position: 2.8},
      {id: 1, query: 'trolleys', click: 167, impression: 4052, ctr: 4.12, position: 3.6},
      {id: 2, query: 'pallet jack', click: 84, impression: 4826, ctr: 1.74, position: 5},
      {id: 3, query: 'stainless steel trolley', click: 65, impression: 552, ctr: 11.78, position: 2.3}
    ];
    return {inputRows, reports};
  }
}