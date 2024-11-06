import {defineStore} from "pinia";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {TableItem} from "bootstrap-vue-next";

export const useEquipmentCollectionStore = defineStore('equipmentCollection', {
    state: (): { items: EquipmentInformationModel[] } => {
        return {
            items: []
        }
    },
    actions: {
        pushItem(item: EquipmentInformationModel) {
            this.items.push(item);
        },
        removeItem(itemId: string) {
            this.items = this.items.filter(i => i.uniqueId !== itemId);
        },
        getEquipmentByTypes(equipmentTypes: string[]): TableItem<EquipmentInformationModel>[] {
            return this.items.filter(e => equipmentTypes.includes(e.categoryCode))
        }
    }
});