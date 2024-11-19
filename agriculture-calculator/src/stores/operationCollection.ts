import {defineStore} from "pinia";
import type {TableItem} from "bootstrap-vue-next";
import type {IOperationCollection} from "@/stores/interfaces/IOperationCollection";
import type {IOperation} from "@/stores/interfaces/IOperation";
import {OperationModel} from "@/stores/models/OperationModel";

export const useOperationCollectionStore = defineStore('operationCollection', {
    state: (): IOperationCollection => {
        return {
            items: []
        }
    },
    actions: {
        pushItem(item: IOperation) {
            this.items.push(new OperationModel(item));
        },
        removeItem(itemId: string) {
            this.items = this.items.filter(i => i.uniqueId !== itemId);
        }
    },
    getters: {
        rows(state: IOperationCollection): TableItem<OperationModel>[] {
            return state.items as TableItem<OperationModel>[];
        }
    }
});
