import {defineStore} from "pinia";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import {
    type EquipmentTypeCategory,
    EquipmentTypesToCategories
} from "@/stores/constants/EquipmentTypes";
import type {OperationType} from "@/stores/constants/OperationTypes";
import {getEquipmentSubTypesByOperation} from "@/stores/constants/OperationTypes";
import {TinyEmitter} from "tiny-emitter";
import type {IFarmland} from "@/stores/interfaces/IFarmland";
import type {IOption} from "@/stores/interfaces/IOption";
import {Crops} from "@/stores/constants/CropTypes";

export const useFarmlandCollectionStore = defineStore('farmlandCollection', {
    state: (): {
        items: IFarmland[]
    } => {
        return {
            items: []
        }
    },
    actions: {
        pushItem(item: IFarmland) {
            if (this.items.some(e => e.uniqueId === item.uniqueId))
                return;
            this.items.push(item);
        },
        removeItem(itemId: string) {
            this.items = this.items.filter(i => i.uniqueId !== itemId);
        }
    },
    getters: {
        itemOptions(state: { items: IFarmland[] }): IOption<IFarmland>[] {
            return state.items.map(i => ({
                value: i,
                text: `${Crops[i.cropType]} ${i.area?.toFixed(2) ?? 0} ha`
            } as IOption<IFarmland>));
        }
    }
});
