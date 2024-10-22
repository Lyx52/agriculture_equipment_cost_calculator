import {defineStore} from "pinia";
import type {IChartState} from "@/stores/interfaces/IChartState";
import type {ITableRow} from "@/interfaces/ITableRow";
import type {IOption} from "@/stores/interfaces/IOption";
import {avg, ChartColumns, ChartDataColumns, ChartGroupingColumns, groupBy} from "@/utils";
import {ChartTypes, DefaultChartColorsHex} from "@/chart_utils";
export const useChartStateStore = defineStore('chartState', {
    state: (): IChartState => {
        return {
            dateFrom: '',
            dateTo: '',
            groupBy: '',
            chartType: 'bar',
            chartDatasets: [],
            chartLabels: [],
            tableData: [],
            tableColumns: [],
        }
    },
    actions: {
        pushChartDataset(data: number[], label: string) {
            if (this.chartType === "bar_and_line") {
                this.chartDatasets.push({
                    data: data,
                    label: label,
                    backgroundColor: this.getNextDatasetColor,
                    type: 'bar'
                });
                this.chartDatasets.push({
                    data: data,
                    label: label,
                    backgroundColor: this.getNextDatasetColor,
                    type: 'line'
                });
                return;
            }
            this.chartDatasets.push({
                data: data,
                label: label,
                backgroundColor: this.getNextDatasetColor,
                type: this.chartType
            });
        },
        buildChart() {
            this.chartDatasets = [];
            let data = this.tableData;
            if (this.dateFrom) {
                console.log(Date.parse(this.dateFrom!), (data[0].timestamp * 1000))
                data = data.filter(r => Date.parse(this.dateFrom!) <= (r.timestamp * 1000));
            }
            if (this.dateTo) {
                console.log(Date.parse(this.dateTo!), (data[0].timestamp * 1000))
                data = data.filter(r => Date.parse(this.dateTo!) >= (r.timestamp * 1000));
            }
            const groups = groupBy<ITableRow, any>(data, (i) => i.date);
            this.chartLabels = Object.keys(groups);

            if (this.groupBy) {

                return;
            }
            const chartData = Object.values(groups).map(v => avg(v, (i) => i.vid_temp_c));

            this.pushChartDataset(chartData, 'Vid temp c');
        },
        async fetchTableData(table: string) {
            let content;
            try {
                const res = await fetch(`/uzc_gazes/${table}/json/query`);
                content = await res.json();
            } catch {
                content = {
                    data: (window as any).FULL_TABLE_DATA
                };
            }
            this.tableData = content.data as ITableRow[];
            if (this.tableData.length > 0) {
                this.tableColumns = Object.keys(this.tableData[0]);
            }
            this.buildChart();
        }
    },
    getters: {
        getNextDatasetColor(state: IChartState): string {
          return DefaultChartColorsHex[Math.min(DefaultChartColorsHex.length - 1, Math.max(0, state.chartDatasets.length - 1))];
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
                .map(c => ({ value: c, text: ChartGroupingColumns[c] } as IOption<string>));
        },
        getChartTypes(state: IChartState): IOption<string>[] {
            return Object.keys(ChartTypes).map(k => ({
                value: k,
                text: ChartTypes[k]
            } as IOption<string>))
        },
    }
});
