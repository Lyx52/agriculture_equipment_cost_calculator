import {defineStore} from "pinia";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {TableItem} from "bootstrap-vue-next";
import {
    type EquipmentType,
    type EquipmentTypeCategory,
    EquipmentTypesToCategories
} from "@/stores/constants/EquipmentTypes";

export const useEquipmentCollectionStore = defineStore('equipmentCollection', {
    state: (): { items: EquipmentInformationModel[] } => {
        return {
            items: []
        }
    },
    actions: {
        pushItem(item: EquipmentInformationModel) {
            if (this.items.some(e => e.uniqueId === item.uniqueId))
                return;
            this.items.push(item);
        },
        removeItem(itemId: string) {
            this.items = this.items.filter(i => i.uniqueId !== itemId);
        },
        getEquipmentByTypeCategory(equipmentTypeCategory: EquipmentTypeCategory): TableItem<EquipmentInformationModel>[] {
            console.log(equipmentTypeCategory, this.items)
            return this.items.filter(e => EquipmentTypesToCategories[e.equipmentType] === equipmentTypeCategory)
        }
    }
});
