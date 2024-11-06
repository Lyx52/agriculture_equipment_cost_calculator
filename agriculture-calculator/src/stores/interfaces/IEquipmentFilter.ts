import type {IOption} from "@/stores/interfaces/IOption";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";

export interface IEquipmentFilter {
    power?: number;
    filterFrom: number;
    filterTo: number;
    powerFilterMoreThan: boolean;
    selectedCategory?: string;
    selectedSubCategory?: string;
    selectedMark?: string;
    selectedModel?: string;
    searchText: string;
    isLoading: boolean;
    categoryOptions: IOption<any>[];
    allSubCategoryOptions: IOption<any>[];
    equipmentMarkOptions: IOption<any>[];
    equipmentModelOptions: IOption<any>[];
    filteredEquipment: IEquipmentInformation[];
    categories?: any;
    subCategories?: any;
    showSearchDropdown: boolean;
    currentSearchFormIndex: number;
    showSearchModal: boolean;
}
