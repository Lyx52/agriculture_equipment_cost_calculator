import type {OperationType} from "@/stores/constants/OperationTypes";
import type {ICostCalculation} from "@/stores/interfaces/ICostCalculation";
import {v4 as uuid} from "uuid";
import type {EquipmentType} from "@/stores/constants/EquipmentTypes";

export class CostCalculationModel implements ICostCalculation {
    operation: OperationType;
    equipmentType: EquipmentType;
    uniqueId: string;
    constructor(item: ICostCalculation) {
        this.operation = item.operation;
        this.equipmentType = item.equipmentType;
        this.uniqueId = uuid();
    }

    get isCombine(): boolean {
        return this.equipmentType === 'combine';
    }
}