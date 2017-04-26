export class InputDataRow {
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    calculatedCtr: number;
    instances: number;
    expected_ctr: number;
    ctr_delta: number;
    expected_clicks: number;
    traffic_loss: number;
    traffic_gain: number;
    nr: number[];
}

export type ServerData = Array< Array< any > >;