import type {TableColumn} from "@/stores/interfaces/IChartState";

export interface IGrouping {
    groupedBy: TableColumn;
    filteredValues: any[];
    uniqueId: string;
}
