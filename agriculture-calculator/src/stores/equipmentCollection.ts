import {defineStore} from "pinia";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import {
    type EquipmentTypeCategory,
    EquipmentTypesToCategories
} from "@/stores/constants/EquipmentTypes";
import type {OperationType} from "@/stores/constants/OperationTypes";
import {getEquipmentSubTypes} from "@/stores/constants/OperationTypes";
import {TinyEmitter} from "tiny-emitter";

export const useEquipmentCollectionStore = defineStore('equipmentCollection', {
    state: (): {
        items: EquipmentInformationModel[],
        collectionEmitter: TinyEmitter
    } => {
        return {
            items: [],
            collectionEmitter: new TinyEmitter()
        }
    },
    actions: {
        pushItem(item: EquipmentInformationModel) {
            if (this.items.some(e => e.uniqueId === item.uniqueId))
                return;
            this.items.push(item);
        },
        removeItem(itemId: string) {
            this.collectionEmitter.emit('item_removed', itemId);
            this.items = this.items.filter(i => i.uniqueId !== itemId);
        },
        getEquipmentByTypeCategory(equipmentTypeCategory: EquipmentTypeCategory): EquipmentInformationModel[] {
            return this.items.filter(e => EquipmentTypesToCategories[e.equipmentType] === equipmentTypeCategory)
        },
        getEquipmentByTypeCategoryAndOperation(equipmentTypeCategory: EquipmentTypeCategory): EquipmentInformationModel[] {
            return this.items
                .filter(e => EquipmentTypesToCategories[e.equipmentType] === equipmentTypeCategory)
                .filter(e => getEquipmentSubTypes(equipmentTypeCategory).includes(e.equipmentSubType))
        },
    }
});
