import type {CropType, IDateInterval} from "@/stores/constants/CropTypes";

export interface IFarmland {
    uniqueId: string;
    cropType: CropType;
    area: number;
    plantingInterval: IDateInterval,
    harvestingInterval: IDateInterval
}
