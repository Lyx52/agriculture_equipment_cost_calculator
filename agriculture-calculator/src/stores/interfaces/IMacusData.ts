import type {MacusDataPowerGroup} from "@/stores/constants/CommonTypes";
import type {EquipmentType} from "@/stores/constants/EquipmentTypes";

export interface IMacusData {
    power_group: MacusDataPowerGroup;
    year: number;
    listing_count: number;
    motor_hours_mean: number;
    price_mean: number;
    category_code: EquipmentType;
}
