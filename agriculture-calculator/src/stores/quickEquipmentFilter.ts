import {defineStore} from "pinia";
import type {IQuickEquipmentFilter} from "@/stores/interfaces/IQuickEquipmentFilter";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";

export const useQuickEquipmentFilterStore = (storeId: string) => defineStore(`quickEquipmentFilter__${storeId}`, {
    state: (): IQuickEquipmentFilter => {
        return {
            searchText: '',
            selectedItem: undefined,
            filteredCategory: ['tractor'],
            showDropdown: false
        }
    },
    actions: {
        async onSearchDropdownScroll() {

        },
        setSelectedEquipment(selected: EquipmentInformationModel) {
            this.selectedItem = selected;
            this.showDropdown = false;
        }
    },
    getters: {
        filteredEquipment(state: IQuickEquipmentFilter): EquipmentInformationModel[] {
            return [];
        }
    }
})();
