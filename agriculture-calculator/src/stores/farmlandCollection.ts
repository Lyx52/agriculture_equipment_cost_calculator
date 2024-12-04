import {defineStore} from "pinia";
import type {IFarmland} from "@/stores/interfaces/IFarmland";
import type {IOption} from "@/stores/interfaces/IOption";
import {
    CropCalendarHarvest,
    CropCalendarPlant,
    CropTypes,
    DefaultDateIntervalHarvest,
    DefaultDateIntervalPlant,
} from "@/stores/constants/CropTypes";
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
            let cropTypeCode = Object.keys(CropTypes).includes(field.productCode ?? '') ? Number(field.productCode) : 111; // Vasaraas kvieši

            this.pushItem({
                uniqueId: uuid(),
                area: field.area,
                cropTypeCode: cropTypeCode,
                plantingInterval: {
                    ...(Object.keys(CropCalendarPlant).includes(String(cropTypeCode)) ? CropCalendarPlant[cropTypeCode] : DefaultDateIntervalPlant)
                },
                harvestingInterval: {
                    ...(Object.keys(CropCalendarHarvest).includes(String(cropTypeCode)) ? CropCalendarHarvest[cropTypeCode] : DefaultDateIntervalHarvest)
                }
            } as IFarmland);
        },
        updateCropCalendar(itemId: string) {
            const farmLand = this.items.find(i => i.uniqueId === itemId)    ;
            if (!farmLand) return;
            farmLand.plantingInterval = {
                ...(Object.keys(CropCalendarPlant).includes(String(farmLand.cropTypeCode)) ? CropCalendarPlant[farmLand.cropTypeCode] : DefaultDateIntervalPlant)
            };
            farmLand.harvestingInterval = {
                ...(Object.keys(CropCalendarHarvest).includes(String(farmLand.cropTypeCode)) ? CropCalendarHarvest[farmLand.cropTypeCode] : DefaultDateIntervalHarvest)
            };
        }
    },
    getters: {
        itemOptions(state: IFarmlandCollection): IOption<IFarmland>[] {
            return state.items.map(i => ({
                value: i,
                text: `${CropTypes[i.cropTypeCode]} ${i.area?.toFixed(2) ?? 0} ha`
            } as IOption<IFarmland>));
        }
    }
});
