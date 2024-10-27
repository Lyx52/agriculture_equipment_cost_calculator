import {defineStore} from "pinia";
import type {IChartState} from "@/stores/interfaces/IChartState";
import type {ITableRow} from "@/interfaces/ITableRow";
import type {IOption} from "@/stores/interfaces/IOption";
import {
    ChartAggregationFunctions,
    type ChartAggregationType,
    ChartAggregationTypes,
    ChartColumns,
    ChartDataColumns,
    ChartGroupingColumns,
    getDateCategory,
    groupBy,
    unique
} from "@/utils";
import {type ChartType, ChartTypes, DefaultChartColorsHex} from "@/chart_utils";
import type {IChartColumn} from "@/stores/interfaces/IChartColumn";
import type {IChartDataset} from "@/stores/interfaces/IChartDataset";

export const useChartStateStore = defineStore('chartState', {
    state: (): IChartState => {
        return {
            dateFrom: '',
            dateTo: '',
            groupBy: 'id_field_nr',
            chartType: 'Bar',
            selectedChartColumn: Object.keys(ChartDataColumns)[0],
            chartColumns: [],
            tableData: [],
            tableColumns: [],
            isLoading: false,
            chartData: {
                datasets: [],
                labels: []
            },
            chartAggregation: 'avg'
        }
    },
    actions: {
        removeColumn(removedColumn: string) {
            this.chartColumns = this.chartColumns.filter((column) => {
                return column.columnKey !== removedColumn
            });
            this.selectedChartColumn = removedColumn;
            this.buildChart();
        },
        addColumn() {
            this.chartColumns.push({
                columnKey: this.selectedChartColumn
            } as IChartColumn);
            this.selectedChartColumn = this.getFilteredDataColumnKeys.length ? this.getFilteredDataColumnKeys[0] : '';
            this.buildChart();
        },
        resetChartDatasets() {
            this.chartData = {
                ...this.chartData,
                labels: [],
                datasets: []
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

            switch (this.chartType) {
                default: {
                    const categories = unique(data.map(getDateCategory));
                    const groups = groupBy<ITableRow, any>(data, (row) => row[this.groupBy]);
                    this.setChartLabels(categories);

                    for (const [key, group] of Object.entries(groups)) {
                        const valuesGroups = groupBy<ITableRow, string>(group, (row) => getDateCategory(row));
                        for (const { columnKey } of this.chartColumns) {
                            let groupingData = Object.fromEntries(categories.map(c => ([c, 0])));
                            for (const [categoryKey, valueGroup] of Object.entries(valuesGroups)) {
                                groupingData[categoryKey] = ChartAggregationFunctions[this.chartAggregation]<ITableRow>(valueGroup, (row) => row[columnKey]);
                            }
                            const color = this.getNextDatasetColor;
                            if (this.chartType === 'BarAndLine') {
                                this.pushChartDataset({
                                    data: Object.values(groupingData as any),
                                    label: `${key} ${this.chartAggregation}(${ChartDataColumns[columnKey]})`,
                                    type: 'line',
                                    backgroundColor: color,
                                    borderColor: color,
                                });
                                this.pushChartDataset({
                                    data: Object.values(groupingData as any),
                                    label: `${key} ${this.chartAggregation}(${ChartDataColumns[columnKey]})`,
                                    type: 'bar',
                                    backgroundColor: color,
                                    borderColor: color,
                                });
                            } else {
                                this.pushChartDataset({
                                    data: Object.values(groupingData as any),
                                    label: `${key} ${this.chartAggregation}(${ChartDataColumns[columnKey]})`,
                                    backgroundColor: color,
                                    borderColor: color,
                                });
                            }
                        }
                    }
                }
            }
        },
        async fetchTableData(table: string) {
            this.isLoading = true;
            try {
                const res = await fetch(`/uzc_gazes/${table}/json/query`);
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
        getChartTypes(state: IChartState): IOption<string>[] {
            return (Object.keys(ChartTypes) as ChartType[]).map(k => ({
                value: k,
                text: ChartTypes[k]
            } as IOption<string>))
        },
        getFilteredDataColumnKeys(state: IChartState): string[] {
            return Object.keys(ChartDataColumns)
                .filter(k => !state.chartColumns.map(c => c.columnKey).includes(k))
        },
        getDataColumns(state: IChartState): IOption<string>[] {
            return Object.keys(ChartDataColumns)
                .filter(k => !state.chartColumns.map(c => c.columnKey).includes(k))
                .map(k => ({
                    value: k,
                    text: ChartDataColumns[k]
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
