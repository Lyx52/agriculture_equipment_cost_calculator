import type {EquipmentLevelType, EquipmentSubType, EquipmentType} from "@/stores/constants/EquipmentTypes";

export interface IEquipmentInformation {
    mark: string;
    model: string;
    price: number;
    category_code: EquipmentType;
    sub_category_code: EquipmentSubType;
    equipment_level_code: EquipmentLevelType;
    specification: string;
    sources: string;
}
