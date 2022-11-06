import { ChartType } from "angular-google-charts"
export type GoogleChart = {
    type: ChartType,
    data: any[];
    title?: string,
    columns?: string[],
    opt: any,
}
