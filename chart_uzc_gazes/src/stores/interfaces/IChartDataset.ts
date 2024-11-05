import type {ChartAggregationType} from "@/utils";
import type {ChartType} from "@/chart_utils";
import type {IChartDatasetTreeValue} from "@/stores/interfaces/IChartDatasetTreeValue";
export interface IChartDataset {
    label?: string;
    data: number[];
    tree: IChartDatasetTreeValue|number[];
    backgroundColor?: string|string[];
    borderColor?: string|string[];
    type: ChartType;
    aggregationType: ChartAggregationType;
    dataColumnKey: string;
    datasetId: string;
}
