import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {EquipmentSubType, EquipmentType} from "@/stores/constants/EquipmentTypes";

export interface IQuickEquipmentFilter {
    selectedItem: EquipmentInformationModel|undefined;
    searchText: string;
    filteredEquipmentTypes: EquipmentType[];
    filteredEquipmentSubTypes: EquipmentSubType[];
    filteredEquipment: EquipmentInformationModel[];
    filteredMark: string|undefined;
    filteredModel: string|undefined;
    filteredPower: number|undefined;
    filteredPowerIsMoreThan: boolean;
    showDropdown: boolean;
    filterFrom: number;
    filterTo: number;
    isLoading: boolean;
}
