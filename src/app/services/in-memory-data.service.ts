import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let inputRows = [
      {id: 0, query: 'trolley', click: 261, impression: 12770, inputted_ctr: 0.0204, position: 2.8},
      {id: 1, query: 'trolleys', click: 167, impression: 4052, inputted_ctr: 0.0412, position: 3.6},
      {id: 2, query: 'pallet jack', click: 84, impression: 4826, inputted_ctr: 0.0174, position: 5},
      {id: 3, query: 'stainless steel trolley', click: 65, impression: 552, inputted_ctr: 0.1178, position: 2.3}
    ];
    let reports = [
      {id: 0, name: 'Report1', keywords: 'trolley,sddf,gkghfg'},
      {id: 1, name: 'Report2 report2', keywords: 'pdf,sddf,gkghfg'},
      {id: 2, name: 'Report3', keywords: 'sdf,dfg,fgt'},
      {id: 3, name: 'Report4 report1, report2', keywords: 'asdas,has'}
    ];
    return {inputRows, reports};
  }
}