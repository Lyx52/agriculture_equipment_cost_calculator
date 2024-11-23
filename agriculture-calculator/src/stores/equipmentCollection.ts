import {defineStore} from "pinia";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {TableItem} from "bootstrap-vue-next";
import {
    type EquipmentType,
    type EquipmentTypeCategory,
    EquipmentTypesToCategories
} from "@/stores/constants/EquipmentTypes";
import type {OperationType} from "@/stores/constants/OperationTypes";
import {EquipmentSubTypesToOperations, getEquipmentSubTypesByOperation} from "@/stores/constants/OperationTypes";

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
            return this.items.filter(e => EquipmentTypesToCategories[e.equipmentType] === equipmentTypeCategory)
        },
        getEquipmentByTypeCategoryAndOperation(equipmentTypeCategory: EquipmentTypeCategory, operationType: OperationType): TableItem<EquipmentInformationModel>[] {
            return this.items
                .filter(e => EquipmentTypesToCategories[e.equipmentType] === equipmentTypeCategory)
                .filter(e => getEquipmentSubTypesByOperation(equipmentTypeCategory, operationType).includes(e.equipmentSubType))
        },
    }
});
