import { defineStore } from 'pinia';
import type {IEquipmentFilter} from "@/stores/interfaces/IEquipmentFilter";
import type {IOption} from "@/stores/interfaces/IOption";
import type {IResponse} from "@/stores/interfaces/IResponse";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
export const useEquipmentFilterStore = defineStore('equipmentFilter',  {
    state: (): IEquipmentFilter => {
        return {
            powerFilterMoreThan: false,
            filterFrom: 0,
            filterTo: 100,
            power: undefined,
            isLoading: false,
            categoryOptions: [],
            allSubCategoryOptions: [],
            equipmentMarkOptions: [],
            equipmentModelOptions: [],
            filteredEquipment: [],
            searchText: '',
            showSearchDropdown: false
        }
    },
    actions: {
        async onCategoryChange() {
            this.selectedSubCategory = undefined;
            this.selectedMark = undefined;
            this.selectedModel = undefined;
            this.equipmentModelOptions = [];
            await this.fetchMark();
            await this.fetchByFilters();
            this.showSearchDropdown = true;
        },
        async onSubCategoryChange() {
            this.selectedMark = undefined;
            this.selectedModel = undefined;
            this.equipmentModelOptions = [];
            await this.fetchMark();
            await this.fetchByFilters();
            this.showSearchDropdown = true;
        },
        async onMarkChange() {
            this.selectedModel = undefined;
            this.equipmentModelOptions = [];
            await this.fetchModels();
            await this.fetchByFilters();
            this.showSearchDropdown = true;
        },
        async onModelChange() {
            await this.fetchByFilters();
            this.showSearchDropdown = true;
        },
        async onSearchDropdownClick() {
            this.showSearchDropdown = true;
            await this.fetchByFilters();
        },
        async onSearchDropdownScroll(e: any) {
            let itemsFromTop = Math.floor(e.target.scrollTop / 24);
            if ((this.filterTo - itemsFromTop) <= 50) {
                this.filterTo += 100;
                await this.fetchByFilters();
            }
        },
        async onPowerFilterMoreThan() {
            this.powerFilterMoreThan = !this.powerFilterMoreThan;
            await this.fetchByFilters();
        },
        async fetchEquipmentCategories() {
            this.isLoading = true;
            try {
                const res = await fetch(`/uzc_gazes/technical_equipment/filters/category`);
                const content = await res.json();

                this.categories = content.reduce((result: any, item: any) => {
                    result[item.category_code] = item.category_name;
                    return result;
                }, {});

                this.subCategories = content.reduce((result: any, item: any) => {
                    let items = result[item.category_code] ?? {};
                    items[item.sub_category_code] = item.sub_category_name;
                    result[item.category_code] = items;
                    return result;
                }, {});

                this.categoryOptions = Object.keys(this.categories).map(k => ({
                    text: this.categories[k],
                    value: k,
                } as IOption<any>));
                this.allSubCategoryOptions = Object.values(this.subCategories).reduce((result: any, item: any) => {
                    result.push(...Object.keys(item).map(k => ({
                        text: item[k],
                        value: k,
                    } as IOption<any>)));

                    return result;
                }, []) as IOption<any>[];
            } finally {
                this.isLoading = false;
            }
        },
        async fetchMark() {
            this.isLoading = true;
            this.selectedModel = undefined;
            this.selectedMark = undefined;
            try {
                const res = await fetch(`/uzc_gazes/technical_equipment/filters/mark?${this.getFilterQuery.toString()}`);
                const content = await res.json();

                this.equipmentMarkOptions = content.map((v: {mark: string}) => ({value: v.mark, text: v.mark}));
            } finally {
                this.isLoading = false;
            }
        },
        async fetchModels() {
            this.isLoading = true;
            try {
                const res = await fetch(`/uzc_gazes/technical_equipment/filters/model?${this.getFilterQuery.toString()}`);
                const content = await res.json();

                this.equipmentModelOptions = content.map((v: {model: string}) => ({value: v.model, text: v.model}));
            } finally {
                this.isLoading = false;
            }
        },
        async fetchByFilters() {
            const params = this.getFilterQuery;
            params.set('from', this.filterFrom.toString());
            params.set('to', this.filterTo.toString());
            console.log(this.searchText);
            if (this.searchText.length >= 2) {
                params.set('search', this.searchText);
            }
            this.isLoading = true;
            try {
                const res = await fetch(`/uzc_gazes/technical_equipment/json/query?${params.toString()}`)
                const content: IResponse<IEquipmentInformation> = await res.json();
                this.filteredEquipment = content.data;
            } finally {
                this.isLoading = false;
            }
        },
    },
    getters: {
        filteredSubCategories(state: IEquipmentFilter): IOption<any>[] {
            if (state.selectedCategory) {
                let items = state.subCategories[state.selectedCategory];
                return Object.keys(items).map(k => ({
                    text: items[k],
                    value: k,
                } as IOption<any>));
            }
            return state.allSubCategoryOptions;
        },
        getFilterQuery(state: IEquipmentFilter): URLSearchParams {
            const query = new URLSearchParams();
            if (state.power && state.power > 0) {
                query.set('operation', state.powerFilterMoreThan ? '0' : '1');
                query.set('power', state.power.toString());
            }
            if (state.selectedCategory) {
                query.set('category', state.selectedCategory);
            }
            if (state.selectedSubCategory) {
                query.set('sub_category', state.selectedSubCategory);
            }
            if (state.selectedMark) {
                query.set('mark', state.selectedMark);
            }
            if (state.selectedModel) {
                query.set('model', state.selectedModel);
            }

            return query;
        }
    },
})
