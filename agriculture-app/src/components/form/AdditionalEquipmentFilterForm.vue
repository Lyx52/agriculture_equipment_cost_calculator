<script setup lang="ts">
import { BAccordion, BAccordionItem, BFormGroup } from 'bootstrap-vue-next'
import { ref } from 'vue'
import VueSlider from "vue-3-slider-component";
import { useEquipmentFilterStore } from '@/stores/equipmentFilter.ts'
import { PowerFilterMax } from '@/constants/EquipmentFilterConstants.ts'
const isFilterOpen = ref<boolean>(false);
const equipmentFilterStore = useEquipmentFilterStore();
const onPowerFilterChanged = async () => {
  await equipmentFilterStore.fetchByFilters();
}
const onFiltersClose = async () => {
  equipmentFilterStore.$patch({
    powerFilter: [0, PowerFilterMax],
    requiredPowerFilter: [0, PowerFilterMax]
  })
  await equipmentFilterStore.fetchByFilters();
}
</script>

<template>
  <BAccordion class="mt-3" >
    <BAccordionItem v-model="isFilterOpen" @hide="onFiltersClose" title="Filtrēt pēc specifikācijas" header-class="filter-accordion" body-class="mb-3">
      <BFormGroup label="Filtrēt pēc jaudas, kw" class="mt-3 mb-3">
        <vue-slider
          v-model="equipmentFilterStore.powerFilter"
          :min="0"
          :max="PowerFilterMax"
          direction="ltr"
          :marks="[0, PowerFilterMax]"
          @drag-end="onPowerFilterChanged"
          :tooltip-formatter="(value: any) => `${value} kw`"
        ></vue-slider>
      </BFormGroup>
      <BFormGroup label="Filtrēt pēc nepieciešamās jaudas, kw" class="mt-4">
        <vue-slider
          v-model="equipmentFilterStore.requiredPowerFilter"
          :min="0"
          :max="PowerFilterMax"
          direction="ltr"
          :marks="[0, PowerFilterMax]"
          @drag-end="onPowerFilterChanged"
          :tooltip-formatter="(value: any) => `${value} kw`"
        ></vue-slider>
      </BFormGroup>
    </BAccordionItem>
  </BAccordion>
</template>

<style>
  .filter-accordion .accordion-button {
    padding: 0.5rem;
  }
</style>
