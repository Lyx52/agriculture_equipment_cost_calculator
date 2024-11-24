import {defineStore} from "pinia";
import type {IQuickEquipmentFilter} from "@/stores/interfaces/IQuickEquipmentFilter";
import type {IResponse} from "@/stores/interfaces/IResponse";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import {unique} from "@/utils";
import type {IOption} from "@/stores/interfaces/IOption";

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
            isLoading: false,
            filteredMark: undefined,
            filteredModel: undefined,
            filteredPower: undefined,
            filteredPowerIsMoreThan: false,
        }
    },
    getters: {
        filteredEquipmentMarkOptions(): IOption<string>[] {
            return unique<string>(this.filteredEquipment.map(e => e.mark)).map((mark: string) => ({
                text: mark,
                value: mark
            } as IOption<string>));
        },
        filteredEquipmentModelOptions(): IOption<string>[] {
            if (this.filteredMark) {
                return unique<string>(this.filteredEquipment.filter(e => e.mark === this.filteredMark).map(e => e.model))
                    .map((model: string) => ({
                        text: model,
                        value: model
                    } as IOption<string>))
            }
            return unique<string>(this.filteredEquipment.map(e => e.model))
                .map((model: string) => ({
                    text: model,
                    value: model
                } as IOption<string>));
        },
    },
    actions: {
        async onSearchDropdownScroll(e: any) {
            let itemsFromTop = Math.floor(e.target.scrollTop / 24);
            if ((this.filterTo - itemsFromTop) <= 50) {
                this.filterTo += 100;
                await this.fetchByFilters();
            }
        },
        async toggleFilteredPowerIsMoreThan() {
            this.filteredPowerIsMoreThan = !this.filteredPowerIsMoreThan;
            await this.fetchByFilters();
        },
        setSelectedEquipment(selected: EquipmentInformationModel) {
            this.selectedItem = selected;
            this.showDropdown = false;
        },
        async fetchByFilters(skipMarkAndModel: boolean = false) {
            const params = new URLSearchParams();
            params.set('category', this.filteredEquipmentTypes.join(','));
            params.set('sub_category', this.filteredEquipmentSubTypes.join(','));
            if (this.filteredMark && !skipMarkAndModel) {
                params.set('mark', this.filteredMark);
            }
            if (this.filteredModel && !skipMarkAndModel) {
                params.set('model', this.filteredModel);
            }
            if (this.filteredPower) {
                params.set('power', this.filteredPower?.toString());
                params.set('is_more_than', this.filteredPowerIsMoreThan ? '1' : '0');
            }
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
        }
    }
})();
