import type {ChartType, DefaultDataPoint} from "chart.js/dist/types";

declare module 'chart.js' {
    interface ChartData<
        TType extends ChartType = ChartType,
        TData = DefaultDataPoint<TType>,
        TLabel = unknown
    > {
        dataLabels: any[];
    }
}
