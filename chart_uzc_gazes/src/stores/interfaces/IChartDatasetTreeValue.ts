export interface IChartDatasetTreeValue {
    value: number;
    children: IChartDatasetTreeValue[];
    groupedBy: string|null;
    groupingKey: string|null;
}