import type {OperationType} from "@/stores/constants/OperationTypes";
import type {EquipmentType} from "@/stores/constants/EquipmentTypes";

export interface ICostCalculation {
    operation: OperationType;
    equipmentType: EquipmentType;
    uniqueId: string;
}