import type {ChartAggregationType} from "@/utils";
import type {ChartType} from "@/chart_utils";
export interface IChartDataset {
    label?: string;
    data: number[];
    dataLabels?: any[];
    backgroundColor?: string|string[];
    borderColor?: string|string[];
    type: string;
    chartType: ChartType;
    aggregationType: ChartAggregationType;
    dataGroupingKey: string;
    dataColumnKey: string;
    datasetId: string;
}
