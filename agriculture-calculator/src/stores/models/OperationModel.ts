import type {OperationType} from "@/stores/constants/OperationTypes";
import type {IOperation} from "@/stores/interfaces/IOperation";
import {v4 as uuid} from "uuid";
import type {EquipmentType} from "@/stores/constants/EquipmentTypes";

export class OperationModel implements IOperation {
    operation: OperationType;
    equipment: EquipmentType[];
    uniqueId: string;
    constructor(item: IOperation) {
        this.operation = item.operation;
        this.equipment = item.equipment;
        this.uniqueId = uuid();
    }

    get isCombine(): boolean {
        return this.equipment.includes('combine');
    }
}
