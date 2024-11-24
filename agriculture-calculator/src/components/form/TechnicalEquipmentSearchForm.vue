<template>
    <div class="d-flex flex-column w-100">
        <div class="form-group"
             v-if="['tractor'].includes(props.equipmentTypeCategory)"
        >
            <label for="inputMachineryCategory">Tehnikas jauda, kw</label>
            <div class="d-flex flex-row mb-3">
                <BButton
                    variant="outline-secondary"
                    @click="filterStore.toggleFilteredPowerIsMoreThan"
                    class="text-nowrap me-2"
                >
                    <span v-if="filterStore.filteredPowerIsMoreThan">Vairāk nekā</span>
                    <span v-if="!filterStore.filteredPowerIsMoreThan">Mazāk nekā</span>
                </BButton>
                <BFormInput
                    type="number"
                    v-model="filterStore.filteredPower"
                    trim aria-describedby="powerKw"
                    @input="filterStore.fetchByFilters"
                />
                <label id="powerKw" class="mt-auto mb-auto ms-2">kw</label>
            </div>
        </div>
        <BFormGroup
            label="Tehnikas kategorija"
            label-for="categorySelect"
            v-if="!defaultEquipmentType()"
        >
            <BFormSelect
                id="categorySelect"
                v-model="filteredEquipmentType"
                :options="getEquipmentTypeOptionsByCategory(props.equipmentTypeCategory)"
            />
        </BFormGroup>
        <BFormGroup
            label="Tehnikas apakškategorija"
            label-for="subCategorySelect"
        >
            <BFormSelect
                id="subCategorySelect"
                v-model="filteredEquipmentSubType"
                :options="getEquipmentSubTypeOptionsByEquipmentType(defaultEquipmentType())"
            />
        </BFormGroup>
        <BSpinningSelect
            id="equipmentMark"
            label="Tehnikas marka"
            :is-spinning="filterStore.isLoading"
            :options="allFilteredEquipmentMarkOptions ?? []"
            v-model="filterStore.filteredMark"
        />
        <BSpinningSelect
            id="equipmentModel"
            label="Tehnikas modelis"
            :is-spinning="filterStore.isLoading"
            :options="filterStore.filteredEquipmentModelOptions"
            v-model="filterStore.filteredModel"
        />
        <BFormGroup
            label="Meklēt tehniku"
            label-for="searchDropdown"
        >
            <div class="dropdown" id="searchDropdown">
                <BFormInput
                    v-model="filterStore.searchText"
                    class="dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    autofocus
                    @click="onOpenDropdown"
                    @input="filterStore.fetchByFilters"
                    ref="_search_bar"
                    autocomplete="false"
                />
                <ul
                    class="dropdown-menu short-dropdown w-100 mw-fit-content"
                    :class="{ show: filterStore.showDropdown }"
                    @scroll="filterStore.onSearchDropdownScroll"
                    ref="_floating"
                >
                    <BOverlay
                        :show="filterStore.isLoading"
                        spinner-small
                    >
                        <li v-for="item in filterStore.filteredEquipment" class="item-height">
                            <a class="dropdown-item" href="#" @click="onClickEquipment(item)">
                                {{ item.fullEquipmentName }}
                            </a>
                        </li>
                    </BOverlay>
                </ul>
            </div>
        </BFormGroup>
    </div>
</template>
<script setup lang="ts">

import {BFormGroup, BFormInput, BFormSelect, BOverlay, BButton} from "bootstrap-vue-next";
import type {ITechnicalEquipmentSearchFormProps} from "@/stores/interfaces/props/ITechnicalEquipmentSearchFormProps";
import {onMounted, ref, useTemplateRef} from "vue";
import {onClickOutside} from "@vueuse/core";
import {useQuickEquipmentFilterStore} from "@/stores/quickEquipmentFilter";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import {
    type EquipmentSubType,
    type EquipmentType,
    getEquipmentSubTypeOptionsByEquipmentType,
    getEquipmentTypeOptionsByCategory,
    getEquipmentTypesByCategory
} from "@/stores/constants/EquipmentTypes";
import BSpinningSelect from "@/components/elements/BSpinningSelect.vue";
import type {IOption} from "@/stores/interfaces/IOption";
const emits = defineEmits(["onEquipmentSelected"]);
const props = defineProps<ITechnicalEquipmentSearchFormProps>();
const filterStore = useQuickEquipmentFilterStore(props.equipmentFilterStoreId);

const floating = useTemplateRef<HTMLElement>('_floating');
const searchBar = useTemplateRef<HTMLElement>('_search_bar');
onClickOutside(floating, () => {
    filterStore.showDropdown = false;
}, {ignore: [searchBar]});

const filteredEquipmentType = ref<EquipmentType>();
const filteredEquipmentSubType = ref<EquipmentSubType>();
const allFilteredEquipmentMarkOptions = ref<IOption<string>[]>();
onMounted(async () => {
    await setFilter(false, true);
    allFilteredEquipmentMarkOptions.value = filterStore.filteredEquipmentMarkOptions;
});

const setFilter = async (showDropdown: boolean,  resetFilter: boolean = false, equipmentType: EquipmentType|undefined = undefined, equipmentSubType: EquipmentSubType|undefined = undefined) => {
    if (resetFilter) {
        filterStore.$reset();
    }

    filterStore.$patch({
        filteredEquipmentTypes: equipmentType ? [equipmentType] : getEquipmentTypesByCategory(props.equipmentTypeCategory),
        filteredEquipmentSubTypes: equipmentSubType ? [equipmentSubType] : [],
        showDropdown: showDropdown
    });
    await filterStore.fetchByFilters();
}
const defaultEquipmentType = (): EquipmentType|undefined => {
    const equipmentTypes = getEquipmentTypesByCategory(props.equipmentTypeCategory);
    return equipmentTypes.length == 1 ? equipmentTypes[0] : undefined;
}

const onOpenDropdown = async () => {
    await setFilter(true,  false, filteredEquipmentType.value ?? defaultEquipmentType(), filteredEquipmentSubType.value);
    await filterStore.fetchByFilters();
}
const onClickEquipment = async (item: EquipmentInformationModel) => {
    emits("onEquipmentSelected", item);
    await setFilter(false, true);
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
