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
    groupBy,
    unique
} from "@/utils";
import {type ChartType, ChartTypes} from "@/chart_utils";
import type {IChartColumn} from "@/stores/interfaces/IChartColumn";
import type {IChartDataset} from "@/stores/interfaces/IChartDataset";
import type {IGrouping} from "@/stores/interfaces/IGrouping";
import type {IChartLabel} from "@/stores/interfaces/IChartLabel";
import type {IChartDatasetTreeValue} from "@/stores/interfaces/IChartDatasetTreeValue";

export const useChartStateStore = defineStore('chartState', {
    state: (): IChartState => {
        return {
            dateFrom: '',
            dateTo: '',
            groupBy: [],
            selectedGroupedBy: 'id_field_nr',
            selectedChartColumn: Object.keys(ChartDataColumns)[0],
            chartColumns: [],
            tableData: [],
            tableColumns: [],
            isLoading: false,
            chartData: {
                datasets: [],
                labels: [],
                dataHidden: false
            },
            selectedChartType: 'bar',
            selectedChartAggregation: 'avg'
        }
    },
    actions: {
        addGrouping() {
            this.groupBy.push({
                groupedBy: this.selectedGroupedBy,
                filteredValues: [],
                uniqueId: uuid()
            } as IGrouping);
            this.selectedGroupedBy = 'id_field_nr';
            this.buildChart();
        },
        removeGrouping(groupingId: string) {
            this.groupBy = this.groupBy.filter((grouping) => {
                return grouping.uniqueId !== groupingId
            });
            this.buildChart();
        },
        removeColumn(columnId: string) {
            this.chartColumns = this.chartColumns.filter((column) => {
                return column.uniqueId !== columnId
            });
            this.buildChart();
        },
        downloadDataset(columnId: string) {
            // const dataset: IChartDataset = this.chartData.datasets.find((dataset: IChartDataset) => {
            //     return dataset.datasetId === columnId
            // });
            //
            // let columns = [
            //     'Datums',
            //     ChartGroupingColumns[this.groupBy.groupedBy],
            //     'Agregācija',
            //     ChartDataColumns[dataset.dataColumnKey]
            // ];
            // let csvData =  [
            //     'sep=,',
            //     columns.join(','),
            //     ...dataset.data.map(((value, index) => {
            //         return `${this.chartData.labels[index]},${dataset.dataGroupingKey},${ChartAggregationTypes[dataset.aggregationType]},${value.toFixed(2)}`
            //     }))
            // ];
            //
            // downloadCsv(csvData, `chart_data_${dataset.aggregationType}_${new Date().toLocaleTimeString()}.csv`);
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
                datasets: []
            }
        },
        pushChartDataset(dataset: IChartDataset): void {
            this.chartData = {
                ...this.chartData,
                datasets: [
                    ...this.chartData.datasets,
                    {
                        ...dataset
                    }
                ]
            }
        },
        pushLabels(labels: IChartLabel[]): void {
            this.chartData = {
                ...this.chartData,
                labels: [
                    ...this.chartData.labels,
                    ...labels,
                ]
            }
        },
        setChartLabels(labels: unknown[]) {
            this.chartData = {
                ...this.chartData,
                labels: labels
            }
        },
        buildLabels(groupingTree: IChartDatasetTreeValue): IChartLabel {
            let children: IChartLabel[] = [];
            for (const childTree of groupingTree.children) {
                children.push(this.buildLabels(childTree))
            }

            return {
                children: children,
                label: groupingTree.groupedBy
            } as IChartLabel;
        },
        buildGroupings(data: ITableRow[], groupedBy: IGrouping[], chartColumn: IChartColumn, parentGroupingKey: string|null = null, parentGroupingBy: string|null = null): IChartDatasetTreeValue {
            const grouping = groupedBy.pop()
            let children: IChartDatasetTreeValue[] = [];

            if (grouping) {
                const groups = groupBy<ITableRow, any>(data, (row) => row[grouping.groupedBy]);
                for (const [group, groupItems] of Object.entries(groups)) {
                    if (grouping.filteredValues.length && !grouping.filteredValues.includes(group)) continue;
                    children.push(this.buildGroupings(groupItems, Array.of(...groupedBy), chartColumn, grouping.groupedBy, group));
                }
            }

            const parentValue = ChartAggregationFunctions[chartColumn.chartAggregation]<ITableRow>(data, item => item[chartColumn.columnKey]);
            return {
                value: parentValue,
                children: children,
                groupedBy: parentGroupingBy,
                groupingKey: parentGroupingKey
            } as IChartDatasetTreeValue;
        },
        simplifyDatasetTree(tree: IChartDatasetTreeValue): IChartDatasetTreeValue|number {
            if (tree.children.length <= 0) return tree.value;

            for (let i = 0; i < tree.children.length; i++) {
                tree.children[i] = this.simplifyDatasetTree(tree.children[i]) as any;
            }

            return tree;
        },
        simplifyDatasetLabelTree(tree: IChartLabel): IChartLabel|string {
            if (tree.children.length <= 0) return tree.label;

            for (let i = 0; i < tree.children.length; i++) {
                tree.children[i] = this.simplifyDatasetLabelTree(tree.children[i]) as any;
            }

            return tree;
        },
        updateGrouping(grouping: IGrouping) {
            grouping.filteredValues = [];
            this.buildChart();
        },
        buildChart() {
            let data = this.tableData;
            if (!this.groupBy.length) return;

            if (this.dateFrom) {
                data = data.filter(r => Date.parse(this.dateFrom!) <= (r.timestamp * 1000));
            }

            if (this.dateTo) {
                data = data.filter(r => Date.parse(this.dateTo!) >= (r.timestamp * 1000));
            }

            this.resetChartDatasets();
            if (this.groupBy.length > 1) {
                let addedLabels = false;
                for (const column of this.chartColumns) {
                    const groupBy = Array.of({
                        groupedBy: 'date',
                        filteredValues: [],
                        uniqueId: '-'
                    }, ...this.groupBy).reverse();
                    const datasetTree = this.buildGroupings(data.sort((a, b) => a.timestamp - b.timestamp), groupBy, column);
                    if (datasetTree.children.length <= 0) continue;
                    if (!addedLabels) {
                        const labelTree = this.simplifyDatasetLabelTree(this.buildLabels(datasetTree as IChartDatasetTreeValue)) as IChartLabel;
                        this.pushLabels(labelTree.children);
                        addedLabels = true;
                    }
                    const simpleDatasetTree = this.simplifyDatasetTree(datasetTree as IChartDatasetTreeValue) as IChartDatasetTreeValue;
                    const dataset = {
                        tree: simpleDatasetTree.children as any[],
                        label: `${column.chartAggregation}(${ChartDataColumns[column.columnKey]})`,
                        type: column.chartType,
                        aggregationType: column.chartAggregation,
                        dataColumnKey: column.columnKey,
                        datasetId: column.uniqueId,
                        data: [],
                    } as IChartDataset;
                    this.pushChartDataset(dataset);
                }
                return;
            }
            const groupedBy = this.groupBy[0];
            const categories = unique(data.map(row => row.timestamp).sort().map(getDateCategory));
            const groups = groupBy<ITableRow, any>(data, (row) => row[groupedBy.groupedBy]);
            this.setChartLabels(categories);
            for (const [key, group] of Object.entries(groups)) {
                if (groupedBy.filteredValues.length && !groupedBy.filteredValues.includes(key)) continue;

                const valuesGroups = groupBy<ITableRow, string>(group, (row) => row.date);
                for (const { columnKey, chartType, chartAggregation, uniqueId } of this.chartColumns) {
                    let groupingData = Object.fromEntries(categories.map(c => ([c, 0])));

                    for (const [categoryKey, valueGroup] of Object.entries(valuesGroups)) {
                        groupingData[categoryKey] = ChartAggregationFunctions[chartAggregation]<ITableRow>(valueGroup, (row) => row[columnKey]);
                    }

                    this.pushChartDataset({
                        data: [],
                        label: `${key} ${chartAggregation}(${ChartDataColumns[columnKey]})`,
                        type: chartType,
                        aggregationType: chartAggregation,
                        dataColumnKey: columnKey,
                        datasetId: uniqueId,
                        tree: Object.values(groupingData as any)
                    });
                }
            }
        },
        filterGroupedByValue(grouping: IGrouping, value: any) {
            if (grouping.filteredValues.includes(value)) {
                grouping.filteredValues = grouping.filteredValues.filter(v => v !== value);
            } else {
                grouping.filteredValues.push(value);
            }

            this.buildChart();
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
                this.tableData = this.tableData.map(row => ({
                    ...row,
                    date: getDateCategory(row.timestamp)
                }))
                this.buildChart();
            } finally {
                this.isLoading = false;
            }
        },
        getGroupedByValues(grouping: IGrouping): any[] {
            return unique(this.tableData.map(item => item[grouping.groupedBy]));
        }
    },
    getters: {
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
