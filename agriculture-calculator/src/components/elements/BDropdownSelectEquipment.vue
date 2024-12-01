<template>
    <div class="dropdown">
        <BButton
            variant="outline-secondary"
            class="w-100"
            @click="filterStore.showDropdown = true"
            v-if="!filterStore.showDropdown"
            ref="_button"
            :class="{
               'btn-danger': !props.isValid
            }"
        >
            <div class="d-flex">
                <span class="ms-auto me-auto">{{ filterStore.selectedItem?.fullEquipmentName ?? '--Izvēlēties--' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill my-auto" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
            </div>
        </BButton>
        <BFormInput
            v-model="filterStore.searchText"
            class="dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            v-if="filterStore.showDropdown"
            autofocus
            @input="filterStore.fetchByFilters"
            ref="_search_bar"
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
                <li><span class="ms-3 text-center fw-bold">Esošā tehnika</span></li>
                <li v-for="item in equipmentCollectionStore.getEquipmentByTypeCategoryAndOperation(props.equipmentTypeCategory, props.operationType)" class="item-height">
                    <a class="dropdown-item cursor-pointer" @click="onClickEquipment(item)">
                        {{ item.fullEquipmentName }}
                    </a>
                </li>
                <BDropdownDivider />
                <li><span class="ms-3 text-center fw-bold">Pievienot jaunu tehniku</span></li>
                <li v-for="item in filterStore.filteredEquipment" class="item-height">
                    <a class="dropdown-item cursor-pointer" @click="onClickEquipment(item)">
                        {{ item.fullEquipmentName }}
                    </a>
                </li>
            </BOverlay>
        </ul>
    </div>
</template>

<script setup lang="ts">
import {
    BFormInput,
    BButton,
    BDropdownDivider,
    BOverlay
} from "bootstrap-vue-next";
import {v4 as uuid} from 'uuid';
import {useQuickEquipmentFilterStore} from "@/stores/quickEquipmentFilter";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
import {onMounted, useTemplateRef, watch} from "vue";
import {onClickOutside, watchArray} from "@vueuse/core";
import type {IBDropdownSelectEquipmentProps} from "@/stores/interfaces/props/IBDropdownSelectEquipmentProps";
import {type EquipmentTypeCategory, getEquipmentTypesByCategory} from "@/stores/constants/EquipmentTypes";
import {getEquipmentSubTypesByOperation, type OperationType} from "@/stores/constants/OperationTypes";
const equipmentCollectionStore = useEquipmentCollectionStore();
const filterStore = useQuickEquipmentFilterStore(uuid());
const floating = useTemplateRef<HTMLElement>('_floating');
const button = useTemplateRef<HTMLElement>('_button');
const searchBar = useTemplateRef<HTMLElement>('_search_bar');
const model = defineModel<EquipmentInformationModel>()
const props = defineProps<IBDropdownSelectEquipmentProps>();
const emits = defineEmits(["onEquipmentSelected"]);

watch(() => props.operationType, async (newOperation, oldOperation) => {
    model.value = undefined;
    filterStore.$reset();
    await onChangeOperation(newOperation, props.equipmentTypeCategory);
});

onClickOutside(floating, () => {
    filterStore.showDropdown = false;
}, {ignore: [button, searchBar]});

equipmentCollectionStore.collectionEmitter.on('item_removed', (itemId: string) => {
    if (filterStore.selectedItem?.uniqueId === itemId) {
        filterStore.$patch({
            selectedItem: undefined
        });
    }
})
onMounted(async () => {
    await onChangeOperation(props.operationType, props.equipmentTypeCategory);
});
const onChangeOperation = async (operationType: OperationType, equipmentTypeCategory: EquipmentTypeCategory) => {
    filterStore.$patch({
        filteredEquipmentTypes: getEquipmentTypesByCategory(equipmentTypeCategory),
        filteredEquipmentSubTypes: getEquipmentSubTypesByOperation(equipmentTypeCategory, operationType)
    });
    await filterStore.fetchByFilters();
}
const onClickEquipment = (selected: EquipmentInformationModel) => {
    filterStore.setSelectedEquipment(selected);
    model.value = selected;
    emits("onEquipmentSelected", selected);
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
