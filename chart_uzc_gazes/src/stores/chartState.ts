import {defineStore} from "pinia";
import type {IChartState} from "@/stores/interfaces/IChartState";
import type {ITableRow} from "@/interfaces/ITableRow";
import type {IOption} from "@/stores/interfaces/IOption";
import { v4 as uuid } from 'uuid';
import {
    ChartAggregationFunctions,
    type ChartAggregationType,
    ChartAggregationTypes,
    ChartColumns,
    ChartDataColumns,
    ChartGroupingColumns, downloadCsv,
    getDateCategory,
    groupBy, pluck,
    unique
} from "@/utils";
import {type ChartType, ChartTypes, DefaultChartColorsHex, getDatasetType} from "@/chart_utils";
import type {IChartColumn} from "@/stores/interfaces/IChartColumn";
import type {IChartDataset} from "@/stores/interfaces/IChartDataset";

export const useChartStateStore = defineStore('chartState', {
    state: (): IChartState => {
        return {
            dateFrom: '',
            dateTo: '',
            groupBy: {
                groupedBy: 'id_field_nr',
                filteredValues: []
            },
            selectedChartColumn: Object.keys(ChartDataColumns)[0],
            chartColumns: [],
            tableData: [],
            tableColumns: [],
            isLoading: false,
            chartData: {
                datasets: [],
                labels: [],
                dataLabels: [],
                dataHidden: false
            },
            selectedChartType: 'bar',
            selectedChartAggregation: 'avg'
        }
    },
    actions: {
        removeColumn(columnId: string) {
            this.chartColumns = this.chartColumns.filter((column) => {
                return column.uniqueId !== columnId
            });
            this.buildChart();
        },
        downloadDataset(columnId: string) {
            const dataset: IChartDataset = this.chartData.datasets.find((dataset: IChartDataset) => {
                return dataset.datasetId === columnId
            });

            let columns = [
                'Datums',
                ChartGroupingColumns[this.groupBy.groupedBy],
                'Agregācija',
                ChartDataColumns[dataset.dataColumnKey]
            ];
            let csvData =  [
                'sep=,',
                columns.join(','),
                ...dataset.data.map(((value, index) => {
                    return `${this.chartData.labels[index]},${dataset.dataGroupingKey},${ChartAggregationTypes[dataset.aggregationType]},${value.toFixed(2)}`
                }))
            ];

            downloadCsv(csvData, `chart_data_${dataset.aggregationType}_${new Date().toLocaleTimeString()}.csv`);
        },
        addColumn() {
            this.chartColumns.push({
                columnKey: this.selectedChartColumn,
                chartType: this.selectedChartType,
                chartAggregation: this.selectedChartAggregation,
                uniqueId: uuid()
            } as IChartColumn);
            this.selectedChartColumn = 'bar';
            this.selectedChartAggregation = 'avg';
            this.selectedChartColumn = Object.keys(ChartDataColumns)[0];
            this.buildChart();
        },
        resetChartDatasets() {
            this.chartData = {
                ...this.chartData,
                labels: [],
                datasets: [],
                dataLabels: []
            }
        },
        pushChartDataLabels(dataLabels: any[]) {
            this.chartData = {
              ...this.chartData,
              dataLabels: dataLabels
          }
        },
        pushChartDataset(dataset: IChartDataset): void {
            this.chartData = {
                ...this.chartData,
                datasets: [
                    ...this.chartData.datasets,
                    {
                        ...dataset,
                        backgroundColor: dataset.backgroundColor ?? this.getNextDatasetColor,
                    }
                ]
            }
        },
        setChartLabels(labels: string[]) {
            this.chartData = {
                ...this.chartData,
                labels: labels
            }
        },
        buildChart() {
            let data = this.tableData;
            if (!this.groupBy) return;

            if (this.dateFrom) {
                data = data.filter(r => Date.parse(this.dateFrom!) <= (r.timestamp * 1000));
            }

            if (this.dateTo) {
                data = data.filter(r => Date.parse(this.dateTo!) >= (r.timestamp * 1000));
            }

            this.resetChartDatasets();

            const categories = unique(data.map(row => row.timestamp).sort().map(getDateCategory));
            const groups = groupBy<ITableRow, any>(data, (row) => row[this.groupBy.groupedBy]);
            this.setChartLabels(categories);

            for (const [key, group] of Object.entries(groups)) {
                if (this.groupBy.filteredValues.length && !this.groupBy.filteredValues.includes(key)) continue;
                const valuesGroups = groupBy<ITableRow, string>(group, (row) => getDateCategory(row.timestamp));
                for (const { columnKey, chartType, chartAggregation, uniqueId } of this.chartColumns) {

                    switch (chartType) {
                        case 'datalabel': {
                            let groupingData = {} as Record<string, string>;
                            for (const [categoryKey, valueGroup] of Object.entries(valuesGroups)) {
                                groupingData[categoryKey] = valueGroup?.length ? valueGroup[0][columnKey] : '';
                            }
                            this.pushChartDataLabels(Object.values(groupingData as any));
                        } break;
                        default: {
                            let groupingData = Object.fromEntries(categories.map(c => ([c, 0])));

                            for (const [categoryKey, valueGroup] of Object.entries(valuesGroups)) {
                                groupingData[categoryKey] = ChartAggregationFunctions[chartAggregation]<ITableRow>(valueGroup, (row) => row[columnKey]);
                            }

                            const color = this.getNextDatasetColor;
                            this.pushChartDataset({
                                data: Object.values(groupingData as any),
                                label: `${key} ${chartAggregation}(${ChartDataColumns[columnKey]})`,
                                backgroundColor: color,
                                borderColor: color,
                                type: getDatasetType(chartType),
                                chartType: chartType,
                                aggregationType: chartAggregation,
                                dataGroupingKey: key,
                                dataColumnKey: columnKey,
                                datasetId: uniqueId
                            });
                        } break;
                    }

                }
            }
        },
        filterGroupedByValue(value: any) {
            if (this.groupBy.filteredValues.includes(value)) {
                this.groupBy.filteredValues = this.groupBy.filteredValues.filter(v => v !== value);
            } else {
                this.groupBy.filteredValues.push(value);
            }

            this.buildChart();
        },
        async fetchTableData(table: string) {
            this.isLoading = true;
            try {
                const res = await fetch(`http://localhost:8888/uzc_gazes/${table}/json/query`);
                const content = await res.json();
                this.tableData = content.data as ITableRow[];
                if (this.tableData.length > 0) {
                    this.tableColumns = Object.keys(this.tableData[0]);
                }
                this.buildChart();
            } finally {
                this.isLoading = false;
            }
        }
    },
    getters: {
        getNextDatasetColor(state: IChartState): string {
          return DefaultChartColorsHex[Math.min(DefaultChartColorsHex.length - 1, Math.max(0, state.chartData.datasets.length))];
        },
        getAllTableColumns(state: IChartState): IOption<string>[] {
            return state.tableColumns.map(c => ({ value: c, text: ChartColumns[c] } as IOption<string>));
        },
        getDataTableColumns(state: IChartState): IOption<string>[] {
            return state.tableColumns
                .filter(c => Object.keys(ChartDataColumns).includes(c))
                .map(c => ({ value: c, text: ChartDataColumns[c] } as IOption<string>));
        },
        getGroupingTableColumns(state: IChartState): IOption<string>[] {
            return state.tableColumns
                .filter(c => Object.keys(ChartGroupingColumns).includes(c))
                .map(c => ({value: c, text: ChartGroupingColumns[c]} as IOption<string>));
        },
        getGroupedByValues(state: IChartState): any[] {
            return unique(state.tableData.map(item => item[this.groupBy.groupedBy]));
        },
        getIsFilteredByGroupedValue(state: IChartState): any[] {
            return unique(state.tableData.map(item => item[this.groupBy.groupedBy]));
        },
        getDataColumns(state: IChartState): IOption<string>[] {
            return Object.keys(ChartDataColumns)
                .map(k => ({
                    value: k,
                    text: ChartDataColumns[k]
                } as IOption<string>))
        },
        getChartTypes(state: IChartState): IOption<string>[] {
            return Object.keys(ChartTypes)
                .map(k => ({
                    value: k,
                    text: ChartTypes[k as ChartType]
                } as IOption<string>))
        },
        getAllDataColumns(state: IChartState): IOption<string>[] {
            return Object.keys(ChartDataColumns)
                .map(k => ({
                    value: k,
                    text: ChartDataColumns[k]
                } as IOption<string>))
        },
        getChartAggregationTypes(state: IChartState): IOption<string>[] {
            return (Object.keys(ChartAggregationTypes) as ChartAggregationType[]).map(k => ({
                value: k,
                text: ChartAggregationTypes[k]
            } as IOption<string>))
        }
    }
});
