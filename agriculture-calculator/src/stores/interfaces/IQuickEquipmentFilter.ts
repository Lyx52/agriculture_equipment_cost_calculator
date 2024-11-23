import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {EquipmentType} from "@/stores/constants/EquipmentTypes";

export interface IQuickEquipmentFilter {
    selectedItem: EquipmentInformationModel|undefined;
    searchText: string;
    filteredEquipmentTypes: EquipmentType[];
    filteredEquipment: EquipmentInformationModel[];
    showDropdown: boolean;
    filterFrom: number;
    filterTo: number;
    isLoading: boolean;
}
