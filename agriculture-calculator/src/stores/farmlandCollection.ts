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
import {CropCalendarHarvest, CropCalendarPlant, Crops, LadCropsToCropType} from "@/stores/constants/CropTypes";
import type {IFarmlandCollection} from "@/stores/interfaces/IFarmlandCollection";
import type {ISelectedMapField} from "@/stores/interfaces/ISelectedMapField";
import {v4 as uuid} from "uuid";

export const useFarmlandCollectionStore = defineStore('farmlandCollection', {
    state: (): IFarmlandCollection => {
        return {
            items: [],
            showMapModal: false
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
        },
        onFarmlandSelected(field: ISelectedMapField) {
            let cropType = Object.keys(LadCropsToCropType).includes(field.productCode ?? '') ? LadCropsToCropType[field.productCode!] : 'spring_wheat';

            this.pushItem({
                uniqueId: uuid(),
                area: field.area,
                cropType: cropType,
                plantingInterval: {
                    ...CropCalendarPlant[cropType]
                },
                harvestingInterval: {
                    ...CropCalendarHarvest[cropType]
                }
            } as IFarmland);
        },
        updateCropCalendar(itemId: string) {
            const farmLand = this.items.find(i => i.uniqueId === itemId)    ;
            if (!farmLand) return;
            farmLand.plantingInterval = {
                ...CropCalendarPlant[farmLand.cropType]
            };
            farmLand.harvestingInterval = {
                ...CropCalendarHarvest[farmLand.cropType]
            };
        }
    },
    getters: {
        itemOptions(state: IFarmlandCollection): IOption<IFarmland>[] {
            return state.items.map(i => ({
                value: i,
                text: `${Crops[i.cropType]} ${i.area?.toFixed(2) ?? 0} ha`
            } as IOption<IFarmland>));
        }
    }
});
