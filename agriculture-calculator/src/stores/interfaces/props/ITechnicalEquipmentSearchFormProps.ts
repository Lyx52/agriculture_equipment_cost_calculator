import type {EquipmentTypeCategory} from "@/stores/constants/EquipmentTypes";

export interface ITechnicalEquipmentSearchFormProps {
    equipmentTypeCategory: EquipmentTypeCategory;
    equipmentFilterStoreId: string;
}