<template>
    <div class="dropdown">
        <BButton
            variant="outline-secondary"
            class="w-100"
            @click="filterStore.showDropdown = true"
            v-if="!filterStore.showDropdown"
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
        />
        <ul
            class="dropdown-menu short-dropdown mw-fit-content"
            :class="{ show: filterStore.showDropdown }"
            @scroll="filterStore.onSearchDropdownScroll"
        >
            <li>Test</li>
            <li v-for="item in equipmentCollectionStore.items" class="item-height">
                <a class="dropdown-item" href="#" @click="onClickEquipment(item)">
                    {{ item.fullEquipmentName }}
                </a>
            </li>
            <BDropdownDivider />
            <li v-for="item in filterStore.filteredEquipment" class="item-height">
                <a class="dropdown-item" href="#" @click="onClickEquipment(item)">
                    {{ item.fullEquipmentName }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import {
    BFormInput,
    BButton,
    BDropdownDivider
} from "bootstrap-vue-next";
import {v4 as uuid} from 'uuid';
import {useQuickEquipmentFilterStore} from "@/stores/quickEquipmentFilter";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
const equipmentCollectionStore = useEquipmentCollectionStore();
const filterStore = useQuickEquipmentFilterStore(uuid());
const onClickEquipment = (selected: EquipmentInformationModel) => {
    console.log(selected);
    filterStore.setSelectedEquipment(selected);
}
</script>

<style scoped>
    .item-height {
        height: 24px !important;
    }
</style>
