import type {EquipmentType} from "@/stores/constants/EquipmentTypes";

export interface IEquipmentInformation {
    id: string;
    fullEquipmentName: string;
    mark: string;
    model: string;
    price: number|undefined;
    hoursOfUse: number|undefined;
    currentUseYears: number|undefined;
    remainingUseYears: number|undefined;
    equipmentLevelCode: string;
    equipmentType: EquipmentType;
    specification: any;
    mainInfo: any;
    sources: string[];
}
