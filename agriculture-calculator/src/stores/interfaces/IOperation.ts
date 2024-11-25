import type {OperationType} from "@/stores/constants/OperationTypes";
import type {EquipmentType} from "@/stores/constants/EquipmentTypes";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {IFarmland} from "@/stores/interfaces/IFarmland";

export interface IOperation {
    operation: OperationType;
    tractor?: EquipmentInformationModel;
    combine?: EquipmentInformationModel;
    equipment?: EquipmentInformationModel;
    farmland?: IFarmland;
    uniqueId: string;
}
