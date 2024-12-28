
<template>
    <div class="dropdown">
        <BOverlay
            :show="props.isLoading && !isDropdownShown"
            spinner-small
        >
            <BButton
                variant="outline-secondary"
                class="w-100"
                @click="isDropdownShown = true"
                v-if="!isDropdownShown"
                ref="_button"
            >
                <div class="d-flex">
                    <span class="ms-auto me-auto">{{ selectedItem?.name ?? 'Izvēlēties' }}</span>
                    <CarretDownIcon />
                </div>
            </BButton>
        </BOverlay>
        <BFormInput
            class="dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            v-if="isDropdownShown"
            autofocus
            v-model="searchText"
            ref="_search_bar"
        />
        <ul
            class="dropdown-menu short-dropdown w-100 mw-fit-content"
            :class="{ show: isDropdownShown }"
            ref="_floating"
        >
            <BOverlay
                :show="props.isLoading"
                spinner-small
            >
                <li v-for="item in props.getFiltered(searchText)" class="item-height" v-bind:key="item.id">
                    <a class="dropdown-item cursor-pointer" @click="onSelectItem(item)">
                        {{ item.name }}
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
import { ref, useTemplateRef, watch } from 'vue'
import {onClickOutside} from "@vueuse/core";
import CarretDownIcon from '@/components/icons/CarretDownIcon.vue'
import type { ISimpleDropdownProps } from '@/props/ISimpleDropdown.ts'
import type { IDropdownOption } from '@/stores/interface/IDropdownOption.ts'
const floating = useTemplateRef<HTMLElement>('_floating');
const button = useTemplateRef<HTMLElement>('_button');
const searchBar = useTemplateRef<HTMLElement>('_search_bar');

const isDropdownShown = ref<boolean>(false);
const searchText = ref<string>('');
const model = defineModel();
const props = defineProps<ISimpleDropdownProps>();
const selectedItem = ref<IDropdownOption<any>|undefined>(model.value ? props.getFormattedOption(model.value) : undefined);

watch(model, (newModelValue) => {
  selectedItem.value = newModelValue ? props.getFormattedOption(newModelValue) : undefined;
});

onClickOutside(floating, () => {
  isDropdownShown.value = false;
  searchText.value = '';
}, {ignore: [button, searchBar]});

const onSelectItem = (item: IDropdownOption<any>) => {
  model.value = item.value;
  isDropdownShown.value = false;
  searchText.value = '';
}

</script>

<style scoped>
    .short-dropdown {
        width: fit-content;
        max-height: 250px;
        overflow-y: auto;
    }
    .cursor-pointer {
      cursor: pointer;
    }
    .item-height {
        height: 24px !important;
    }
</style>
