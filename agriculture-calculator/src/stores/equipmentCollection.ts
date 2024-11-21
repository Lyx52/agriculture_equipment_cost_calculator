import {defineStore} from "pinia";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
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
            this.items.push(item);
        },
        removeItem(itemId: string) {
            this.items = this.items.filter(i => i.uniqueId !== itemId);
        },
        getEquipmentByTypeCategory(equipmentTypeCategory: EquipmentTypeCategory): TableItem<EquipmentInformationModel>[] {
            return this.items.filter(e => EquipmentTypesToCategories[e.equipmentType] === equipmentTypeCategory)
        }
    }
});
