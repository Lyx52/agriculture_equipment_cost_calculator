import {defineStore} from "pinia";
import type {IQuickEquipmentFilter} from "@/stores/interfaces/IQuickEquipmentFilter";
import type {IResponse} from "@/stores/interfaces/IResponse";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";

export const useQuickEquipmentFilterStore = (storeId: string) => defineStore(`quickEquipmentFilter__${storeId}`, {
    state: (): IQuickEquipmentFilter => {
        return {
            searchText: '',
            selectedItem: undefined,
            filteredEquipmentTypes: ['tractor'],
            filteredEquipmentSubTypes: ['tractor_4x2', 'tractor_4x4'],
            showDropdown: false,
            filteredEquipment: [],
            filterTo: 100,
            filterFrom: 0,
            isLoading: false
        }
    },
    actions: {
        async onSearchDropdownScroll(e: any) {
            let itemsFromTop = Math.floor(e.target.scrollTop / 24);
            if ((this.filterTo - itemsFromTop) <= 50) {
                this.filterTo += 100;
                await this.fetchByFilters();
            }
        },
        setSelectedEquipment(selected: EquipmentInformationModel) {
            this.selectedItem = selected;
            this.showDropdown = false;
        },
        async fetchByFilters() {
            const params = new URLSearchParams();
            params.set('category', this.filteredEquipmentTypes.join(','));
            params.set('sub_category', this.filteredEquipmentSubTypes.join(','));
            params.set('from', this.filterFrom.toString());
            params.set('to', this.filterTo.toString());
            if (this.searchText.length >= 2) {
                params.set('search', this.searchText);
            }
            this.isLoading = true;
            try {
                const res = await fetch(`http://localhost:8888/uzc_gazes/technical_equipment/query?${params.toString()}`)
                const content: IResponse<IEquipmentInformation> = await res.json();
                this.filteredEquipment = content.data.map(e => new EquipmentInformationModel(e));
            } finally {
                this.isLoading = false;
            }
        },
    }
})();
