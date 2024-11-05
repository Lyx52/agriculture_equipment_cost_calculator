import type {ITableRow} from "@/interfaces/ITableRow";
import type {IChartColumn} from "@/stores/interfaces/IChartColumn";
import type {IChartProps} from "@/interfaces/IChartProps";
import type {ChartAggregationType} from "@/utils";
import type {ChartType} from "@/chart_utils";
import type {IGrouping} from "@/stores/interfaces/IGrouping";
export type TableColumn = string & keyof ITableRow;

export interface IChartState {
    dateFrom?: string;
    dateTo?: string;
    groupBy: IGrouping[];
    chartData: IChartProps;
    chartColumns: IChartColumn[];
    selectedChartColumn: string;
    selectedChartType: ChartType;
    selectedChartAggregation: ChartAggregationType;
    selectedGroupedBy: TableColumn;
    tableData: ITableRow[];
    tableColumns: string[];
    isLoading: boolean;
}
