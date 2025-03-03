<script setup lang="ts">
import { BButton, BFormGroup, BTableSimple, BTbody, BTd, BTh, BThead, BTr } from 'bootstrap-vue-next'
import { useFarmlandStore } from '@/stores/farmland.ts'
import { sumBy } from '../utils.ts'
import SimpleDropdown from '@/components/elements/SimpleDropdown.vue'
import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'
import { computed, ref } from 'vue'
import IconX from '@/components/icons/IconX.vue'
const farmlandStore = useFarmlandStore();
const selectedFarmland = ref<FarmlandModel|undefined>(undefined);
const handleRemoveSelected = () => {
  selectedFarmland.value = undefined;
}
const hasSelectedFilter = computed(() => !!selectedFarmland.value);
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <BFormGroup label="Skatīt detalizētu lauka bruto segumu">
        <div class="d-flex flex-row">
          <SimpleDropdown
            class="w-fit"
            :is-loading="false"
            :is-invalid="false"
            :get-filtered="farmlandStore.getFiltered"
            :get-formatted-option="farmlandStore.getFormattedOption"
            v-model="selectedFarmland"
          />

          <BButton v-if="hasSelectedFilter" variant="danger" class="ms-2 mt-auto" @click="handleRemoveSelected">
            <IconX />
          </BButton>
        </div>
      </BFormGroup>

    </div>
    <div class="row" v-if="hasSelectedFilter">
      sdadasd
    </div>
    <div class="row" v-else>
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
        <caption>
          <h5 class="text-center fw-bold text-black">Bruto seguma novērtējums</h5>
        </caption>
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh>Apstrādes lauks</BTh>
            <BTh>Lauka platība, ha</BTh>
            <BTh>Ieņēmumi, EUR/ha</BTh>
            <BTh>Patstāvīgās izmaksas, EUR/ha</BTh>
            <BTh>Mainīgās izmaksas, EUR/ha</BTh>
            <BTh>Bruto segums, EUR/ha</BTh>
            <BTh>Bruto segums, EUR</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in farmlandStore.items" v-bind:key="row.id">
            <BTd class="text-start align-middle">
              {{ `${row?.product_name ?? 'Lauks'} (${(row?.area ?? 0).toFixed(2)} ha)` }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ row.landArea.toFixed(2) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ row.earningsPerHectare.toFixed(2) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ row.totalOwnershipCostsPerHectare.toFixed(2) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ row.totalOperatingCostsPerHectare.toFixed(2) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ row.grossCoveragePerHectare.toFixed(2) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ row.grossCoverage.toFixed(2) }}
            </BTd>
          </BTr>
          <BTr class="fw-bold">
            <BTd class="text-end user-select-none vertical-align-middle" colspan="1">Kopā</BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ sumBy(farmlandStore.items, e => e.landArea).toFixed(2) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ sumBy(farmlandStore.items, e => e.earningsPerHectare).toFixed(2) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ sumBy(farmlandStore.items, e => e.totalOwnershipCostsPerHectare).toFixed(2) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ sumBy(farmlandStore.items, e => e.totalOperatingCostsPerHectare).toFixed(2) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ sumBy(farmlandStore.items, e => e.grossCoveragePerHectare).toFixed(2) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ sumBy(farmlandStore.items, e => e.grossCoverage).toFixed(2) }}
            </BTd>
          </BTr>
        </BTbody>
      </BTableSimple>
    </div>
  </div>

</template>

<style scoped>
.table-height {
  max-height: 40vh;
  min-height: 25vh;
}
.in-front {
  z-index: 999;
}
.cursor-pointer {
  cursor: pointer;
}
.vertical-align-middle {
  vertical-align: middle !important;
}
.w-fit-content {
  width: fit-content;
}
</style>
