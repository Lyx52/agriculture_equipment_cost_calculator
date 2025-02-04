
<template>
    <div class="dropdown">
        <BOverlay
            :show="isLoading && !isDropdownShown"
            spinner-small
        >
            <BButton
                variant="outline-secondary"
                class="w-100"
                v-model:pressed="isDropdownShown"
                @click="fetchByFilters"
                v-if="!isDropdownShown"
                ref="_button"
                :class="{
                   'btn-danger': !props.isValid
                }"
            >
                <div class="d-flex">
                    <span class="ms-auto me-auto">{{ codifierStore.selectedItem?.name ?? 'Izvēlēties' }}</span>
                    <CarretDownIcon />
                </div>
            </BButton>
        </BOverlay>
        <BFormInput
            class="dropdown-toggle"
            :class="{
              'd-none': !isDropdownShown,
              'd-block': isDropdownShown,
            }"
            @input="fetchByFilters"
            v-model="searchText"
            ref="_search_bar"
        />
        <ul
            class="dropdown-menu short-dropdown w-100 mw-fit-content show"
            v-if="isDropdownShown"
            @scroll="onScroll"
            ref="_floating"
        >
            <BOverlay
                :show="isLoading"
                spinner-small
            >
                <li v-for="item in codifierStore.filteredItems" class="item-height" v-bind:key="item.code">
                    <a class="dropdown-item cursor-pointer" @click="onSelectItem(item)">
                        {{ item.name }} {{ props.showValue ? `(${item.value})` : '' }}
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
import { onClickOutside, watchArray } from '@vueuse/core'
import type { ICodifierDropdown } from '@/props/ICodifierDropdown.ts'
import { useCodifierStore } from '@/stores/codifier.ts'
import { v4 as uuid } from 'uuid';
import type { ICodifier } from '@/stores/interface/ICodifier.ts'
import CarretDownIcon from '@/components/icons/CarretDownIcon.vue'
import { arraysEqual } from '@/utils.ts'
const floating = useTemplateRef<HTMLElement>('_floating');
const button = useTemplateRef<HTMLElement>('_button');
const searchBar = useTemplateRef<HTMLElement>('_search_bar');

const isLoading = ref<boolean>(false);
const isDropdownShown = ref(false);
const searchText = ref<string>('');
const props = defineProps<ICodifierDropdown>();
const codifierStore = useCodifierStore(props.storeId ?? uuid())
const emits = defineEmits(['onSelected']);
onClickOutside(floating, () => {
  isLoading.value = false;
  isDropdownShown.value = false;
  searchText.value = '';
}, {ignore: [button, searchBar]});
watchArray(() => props.parentCodifierCodes, async (newParentCodes, oldParentCodes) => {
  if (arraysEqual(newParentCodes, oldParentCodes)) {
    return;
  }
  codifierStore.$patch({
    codifierTypeCodes: newParentCodes,
    selectedItem: undefined,
    searchText: '',
    filterTo: 25
  });
  isLoading.value = false;
  searchText.value = '';
});

const fetchByFilters = async () => {
  codifierStore.resetFilters();
  codifierStore.$patch({
    codifierTypeCodes: props.parentCodifierCodes,
    searchText: searchText.value
  });
  try {
    isLoading.value = true;
    await codifierStore.fetchByFilters();
  } finally {
    isLoading.value = false;
  }
}
const onSelectItem = (item: ICodifier) => {
  codifierStore.$patch({
    selectedItem: item
  })
  isLoading.value = false;
  isDropdownShown.value = false;
  searchText.value = '';
  emits('onSelected', item);
}
const onScroll = async (e: any) => {
  const itemsFromTop = Math.floor(e.target.scrollTop / 24);
  if ((codifierStore.filterTo - itemsFromTop) <= 10) {
    codifierStore.filterTo += 10;
    try {
      isLoading.value = true;
      await codifierStore.fetchByFilters();
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
      max-width: 600px;
    }
    .cursor-pointer {
      cursor: pointer;
    }
    .item-height {
        height: 24px !important;
    }
</style>
