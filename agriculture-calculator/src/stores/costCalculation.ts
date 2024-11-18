import {defineStore} from "pinia";
import type {TableItem} from "bootstrap-vue-next";
import type {ICostCalculationCollection} from "@/stores/interfaces/ICostCalculationCollection";
import type {ICostCalculation} from "@/stores/interfaces/ICostCalculation";
import {CostCalculationModel} from "@/stores/models/CostCalculationModel";

export const useCostCalculationStore = defineStore('costCalculation', {
    state: (): ICostCalculationCollection => {
        return {
            items: []
        }
    },
    actions: {
        pushItem(item: ICostCalculation) {
            this.items.push(new CostCalculationModel(item));
        },
        removeItem(itemId: string) {
            this.items = this.items.filter(i => i.uniqueId !== itemId);
        }
    },
    getters: {
        rows(state: ICostCalculationCollection): TableItem<CostCalculationModel>[] {
            return state.items as TableItem<CostCalculationModel>[];
        }
    }
});