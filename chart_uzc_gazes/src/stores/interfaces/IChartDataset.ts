import type {ChartAggregationType} from "@/utils";

export interface IChartDataset {
    label?: string;
    data: number[],
    backgroundColor?: string|string[];
    borderColor?: string|string[];
    type?: string;
    aggregationType: ChartAggregationType;
    dataGroupingKey: string;
    dataColumnKey: string;
    datasetId: string;
}
