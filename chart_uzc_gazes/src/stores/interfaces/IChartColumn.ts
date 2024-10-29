import type {TableColumn} from "@/stores/interfaces/IChartState";
import type {ChartType} from "@/chart_utils";
import type {ChartAggregationType} from "@/utils";

export interface IChartColumn {
    columnKey: TableColumn;
    chartType: ChartType;
    chartAggregation: ChartAggregationType;
    uniqueId: string;
}
