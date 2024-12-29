
<template>
    <div class="dropdown">
        <BOverlay
            :show="isLoading && !isDropdownShown"
            spinner-small
        >
            <BButton
                variant="outline-secondary"
                class="w-100"
                @click="fetchByFilters"
                v-if="!isDropdownShown"
                ref="_button"
            >
                <div class="d-flex">
                    <span class="ms-auto me-auto">
                      {{ equipmentFilterStore.selectedItem ? `${equipmentFilterStore.selectedItem.manufacturer} ${equipmentFilterStore.selectedItem.model}` : 'Izvēlēties' }}
                    </span>
                    <CarretDownIcon />
                </div>
            </BButton>
        </BOverlay>
        <BFormInput
            class="dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            :class="{
              'd-none': !isDropdownShown,
              'd-block': isDropdownShown,
            }"
            @input="fetchByFilters"
            v-model="searchText"
            ref="_search_bar"
        />
        <ul
            class="dropdown-menu short-dropdown w-100 mw-fit-content"
            :class="{ show: isDropdownShown }"
            @scroll="onScroll"
            ref="_floating"
        >
            <BOverlay
                :show="isLoading"
                spinner-small
            >
                <li v-for="item in equipmentFilterStore.filteredItems" class="item-height" v-bind:key="item.id">
                    <a class="dropdown-item cursor-pointer" @click="onSelectItem(item)">
                      {{ `${item.manufacturer} ${item.model}` }}
                    </a>
                </li>
            </BOverlay>
        </ul>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable  @typescript-eslint/no-explicit-any */

import {
    BFormInput,
    BButton,
    BOverlay
} from "bootstrap-vue-next";
import { ref, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'
import CarretDownIcon from '@/components/icons/CarretDownIcon.vue'
import { useEquipmentFilterStore } from '@/stores/equipmentFilter.ts'
import type { IEquipment } from '@/stores/interface/IEquipment.ts'
const floating = useTemplateRef<HTMLElement>('_floating');
const button = useTemplateRef<HTMLElement>('_button');
const searchBar = useTemplateRef<HTMLElement>('_search_bar');
const isLoading = ref<boolean>();
const isDropdownShown = ref<boolean>(false);
const searchText = ref<string>('');
const equipmentFilterStore = useEquipmentFilterStore()
const emits = defineEmits(['onSelected']);
onClickOutside(floating, () => {
  isLoading.value = false;
  isDropdownShown.value = false;
  searchText.value = '';
}, {ignore: [button, searchBar]});

const fetchByFilters = async () => {
  equipmentFilterStore.$patch({
    searchText: searchText.value,
    filterTo: 50
  });
  isDropdownShown.value = true;
  try {
    isLoading.value = true;
    await equipmentFilterStore.fetchByFilters();
  } finally {
    isLoading.value = false;
  }
}
const onSelectItem = (item: IEquipment) => {
  equipmentFilterStore.$patch({
    selectedItem: item
  })
  isLoading.value = false;
  isDropdownShown.value = false;
  searchText.value = '';
  emits('onSelected', item);
}
const onScroll = async (e: any) => {
  const itemsFromTop = Math.floor(e.target.scrollTop / 24);
  if ((equipmentFilterStore.filterTo - itemsFromTop) <= 25) {
    equipmentFilterStore.filterTo += 25;
    try {
      isLoading.value = true;
      await equipmentFilterStore.fetchByFilters();
    } finally {
      isLoading.value = false;
    }
  }
}
</script>

<style scoped>
    .short-dropdown {
      max-height: 250px;
      overflow-y: auto;
      width: fit-content !important;
    }
    .cursor-pointer {
      cursor: pointer;
    }
    .item-height {
        height: 24px !important;
    }
</style>
