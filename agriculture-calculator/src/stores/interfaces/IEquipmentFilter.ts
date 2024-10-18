import type {IOption} from "@/stores/interfaces/IOption";

export interface IEquipmentFilter {
    power?: number;
    powerFilterMoreThan: boolean;
    selectedCategory?: string;
    selectedSubCategory?: string;
    selectedMark?: string;
    selectedModel?: string;
    isLoading: boolean;
    categoryOptions: IOption[];
    allSubCategoryOptions: IOption[];
    equipmentMarkOptions: IOption[];
    equipmentModelOptions: IOption[];
    categories?: any;
    subCategories?: any;
}