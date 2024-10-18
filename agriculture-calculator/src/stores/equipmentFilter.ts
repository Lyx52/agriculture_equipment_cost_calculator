import { defineStore } from 'pinia';
import type {IEquipmentFilter} from "@/stores/interfaces/IEquipmentFilter";
import type {IOption} from "@/stores/interfaces/IOption";
export const useEquipmentFilterStore = defineStore('equipmentFilter',  {
    state: (): IEquipmentFilter => {
        return {
            powerFilterMoreThan: false,
            power: -1,
            isLoading: false,
            categoryOptions: [],
            allSubCategoryOptions: [],
            equipmentMarkOptions: [],
            equipmentModelOptions: []
        }
    },
    actions: {
        async onCategoryChange() {
            this.selectedSubCategory = undefined;
            this.selectedMark = undefined;
            this.selectedModel = undefined;
            this.equipmentModelOptions = [];
            await this.fetchMark();
        },
        async onSubCategoryChange() {
            this.selectedMark = undefined;
            this.selectedModel = undefined;
            this.equipmentModelOptions = [];
            await this.fetchMark();
        },
        async onMarkChange() {
            this.selectedModel = undefined;
            this.equipmentModelOptions = [];
            await this.fetchModels();
        },
        async onModelChange() {

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
                } as IOption));
                this.allSubCategoryOptions = Object.values(this.subCategories).reduce((result: any, item: any) => {
                    result.push(...Object.keys(item).map(k => ({
                        text: item[k],
                        value: k,
                    } as IOption)));

                    return result;
                }, []) as IOption[];
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
        }
    },
    getters: {
        filteredSubCategories(state: IEquipmentFilter): IOption[] {
            if (state.selectedCategory) {
                let items = state.subCategories[state.selectedCategory];
                return Object.keys(items).map(k => ({
                    text: items[k],
                    value: k,
                } as IOption));
            }
            return state.allSubCategoryOptions;
        },
        getFilterQuery(state: IEquipmentFilter): URLSearchParams {
            const query = new URLSearchParams();
            if (state.power && state.power > 0) {
                query.set('operation', state.powerFilterMoreThan ? '1' : '0');
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
