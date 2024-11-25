import type {OperationType} from "@/stores/constants/OperationTypes";
import type {IOperation} from "@/stores/interfaces/IOperation";
import {v4 as uuid} from "uuid";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {IFarmland} from "@/stores/interfaces/IFarmland";

export class OperationModel implements IOperation {
    operation: OperationType;
    equipment?: EquipmentInformationModel;
    combine?: EquipmentInformationModel;
    tractor?: EquipmentInformationModel;
    farmland?: IFarmland;
    uniqueId: string;

    constructor(item: IOperation) {
        this.operation = item.operation;
        this.equipment = item.equipment;
        this.tractor = item.tractor;
        this.combine = item.combine;
        this.farmland = item.farmland;
        this.uniqueId = uuid();
    }
}
