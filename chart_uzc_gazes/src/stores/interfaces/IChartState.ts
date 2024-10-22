import type {ITableRow} from "@/interfaces/ITableRow";

export interface IChartState {
    dateFrom?: string;
    dateTo?: string;
    groupBy?: string;
    chartType?: string;
    chartDatasets: any[];
    chartLabels: string[];
    tableData: ITableRow[];
    tableColumns: string[];
}
