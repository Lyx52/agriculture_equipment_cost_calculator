import type {EquipmentTypeCategory} from "@/stores/constants/EquipmentTypes";
import type {OperationType} from "@/stores/constants/OperationTypes";

export interface IBDropdownSelectEquipmentProps {
    equipmentTypeCategory: EquipmentTypeCategory;
    operationType: OperationType;
    isValid: boolean;
}