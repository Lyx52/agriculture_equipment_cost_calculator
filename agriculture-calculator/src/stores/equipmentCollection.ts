import {defineStore} from "pinia";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";

export const useEquipmentCollectionStore = defineStore('equipmentCollection', {
    state: (): { items: IEquipmentInformation[] } => {
        return {
            items: []
        }
    },
    actions: {
        pushItem(item: IEquipmentInformation) {
            this.items.push(item);
        },
    }
});