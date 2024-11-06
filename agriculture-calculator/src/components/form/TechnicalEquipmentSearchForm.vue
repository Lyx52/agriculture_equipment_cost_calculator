<template>
    <div class="d-flex flex-column w-100">
        <div class="form-group">
            <label for="inputMachineryCategory">Tehnikas jauda, kw</label>
            <div class="d-flex flex-row mb-3">
                <BButton
                    variant="outline-secondary"
                    @input="filterStore.onPowerFilterMoreThan"
                    class="text-nowrap me-2"
                >
                    <span v-if="filterStore.powerFilterMoreThan">Vairāk nekā</span>
                    <span v-if="!filterStore.powerFilterMoreThan">Mazāk nekā</span>
                </BButton>
                <BFormInput
                    type="number"
                    v-model="filterStore.power"
                    trim aria-describedby="powerKw"
                    @change="filterStore.fetchByFilters"
                />
                <label id="powerKw" class="mt-auto mb-auto ms-2">kw</label>
            </div>
        </div>
        <BSpinningSelect
            id="inputMachineryCategory"
            label="Tehnikas kategorija"
            @change="filterStore.onCategoryChange"
            :is-spinning="filterStore.isLoading"
            :options="filterStore.categoryOptions"
            v-model="filterStore.selectedCategory"
        />
        <BSpinningSelect
            id="inputMachinerySubCategory"
            label="Tehnikas apakškategorija"
            @change="filterStore.onSubCategoryChange"
            :is-spinning="filterStore.isLoading"
            :options="filterStore.filteredSubCategories"
            v-model="filterStore.selectedSubCategory"
        />
        <BSpinningSelect
            id="inputMachineryMark"
            label="Tehnikas marka"
            @change="filterStore.onMarkChange"
            :is-spinning="filterStore.isLoading"
            :options="filterStore.equipmentMarkOptions"
            v-model="filterStore.selectedMark"
        />
        <BSpinningSelect
            id="inputMachineryModel"
            label="Tehnikas modelis"
            @change="filterStore.onModelChange"
            :is-spinning="filterStore.isLoading"
            :options="filterStore.equipmentModelOptions"
            v-model="filterStore.selectedModel"
        />
        <label for="searchDropdown">Meklēt tehniku</label>
        <div class="dropdown" id="searchDropdown">
            <BFormInput
                v-model="filterStore.searchText"
                @input="filterStore.fetchByFilters"
                @click="filterStore.onSearchDropdownClick"
                class="dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            />
            <ul
                class="dropdown-menu short-dropdown"
                :class="{ show: filterStore.showSearchDropdown }"
                @scroll="filterStore.onSearchDropdownScroll"
            >
                <li v-for="item in filterStore.filteredEquipment" class="item-height">
                    <a class="dropdown-item" href="#" @click="onClickEquipment(item)">
                        {{ item.fullEquipmentName }}
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup lang="ts">

import {BButton, BFormInput} from "bootstrap-vue-next";
import BSpinningSelect from "@/components/BSpinningSelect.vue";
import {useEquipmentFilterStore} from "@/stores/equipmentFilter";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import {onMounted} from "vue";
import type {ITechnicalEquipmentSearchFormProps} from "@/stores/interfaces/props/ITechnicalEquipmentSearchFormProps";
const props = defineProps<ITechnicalEquipmentSearchFormProps>();
const filterStore = useEquipmentFilterStore();
onMounted(async() => {
    filterStore.equipmentTypes = props?.equipmentTypes ?? [];
    await filterStore.fetchEquipmentCategories();
})

const emit = defineEmits(["onEquipmentSelected"])

const onClickEquipment = (item: IEquipmentInformation) => {
    emit("onEquipmentSelected", item);
    filterStore.$patch({
        showSearchDropdown: false,
        searchText: '',
        selectedModel: '',
        selectedMark: '',
        selectedCategory: '',
        selectedSubCategory: ''
    });
}
</script>

<style scoped>
.short-dropdown {
    width: fit-content;
    max-height: 250px;
    overflow-y: auto;
}
.item-height {
    height: 24px !important;
}
</style>