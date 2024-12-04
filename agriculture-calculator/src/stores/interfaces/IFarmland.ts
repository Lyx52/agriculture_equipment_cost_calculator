import type {IDateInterval} from "@/stores/constants/CropTypes";

export interface IFarmland {
    uniqueId: string;
    cropTypeCode: number;
    area: number;
    plantingInterval: IDateInterval,
    harvestingInterval: IDateInterval
}
