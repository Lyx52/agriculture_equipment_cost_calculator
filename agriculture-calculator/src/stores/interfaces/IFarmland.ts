import type {CropType} from "@/stores/constants/CropTypes";

export interface IFarmland {
    uniqueId: string;
    cropType: CropType;
    area: number;
}
