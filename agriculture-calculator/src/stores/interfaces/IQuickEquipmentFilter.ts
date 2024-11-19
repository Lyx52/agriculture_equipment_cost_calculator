import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import type {EquipmentType} from "@/stores/constants/EquipmentTypes";

export interface IQuickEquipmentFilter {
    selectedItem: EquipmentInformationModel|undefined;
    searchText: string;
    filteredCategory: EquipmentType[];
    showDropdown: boolean;
}
