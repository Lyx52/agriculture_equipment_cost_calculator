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
            <BDropdownSelectEquipment
                :equipment-type-category="props.equipmentTypeCategory"
                :is-valid="true"
                :filter-store-id="props.equipmentFilterStoreId"
                id="searchDropdown"
                @on-equipment-selected="onClickEquipment"
                :show-existing="false"
            />
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
import BDropdownSelectEquipment from "@/components/elements/BDropdownSelectEquipment.vue";
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
    await filterStore.fetchByFilters();
    allFilteredEquipmentMarkOptions.value = filterStore.filteredEquipmentMarkOptions;
});

const defaultEquipmentType = (): EquipmentType|undefined => {
    const equipmentTypes = getEquipmentTypesByCategory(props.equipmentTypeCategory);
    return equipmentTypes.length == 1 ? equipmentTypes[0] : undefined;
}
const onClickEquipment = (item: EquipmentInformationModel) => {
    emits("onEquipmentSelected", item);
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
