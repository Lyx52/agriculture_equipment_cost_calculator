<script setup lang="ts">
import { BTableSimple, BTbody, BTd, BTh, BThead, BTr, BFormSelect, BInputGroup } from 'bootstrap-vue-next'
import { onMounted, ref } from 'vue'
import { useOperationStore } from '@/stores/operation.ts'
import { useCodifierStore } from '@/stores/codifier.ts'
import { Codifiers } from '@/stores/enums/Codifiers.ts'
import {v4 as uuid} from 'uuid'
import { sumBy } from '@/utils.ts'
import { useFarmlandStore } from '@/stores/farmland.ts'

const operationStore = useOperationStore();
const farmlandStore = useFarmlandStore();
const codifierStore = useCodifierStore(uuid());
const selectedCalculatePer = ref<string>('kopā');
const calculatePerOptions = [
  { value: 'kopā', text: 'kopā' },
  { value: 'h', text: 'stundā' },
  { value: 'ha', text: 'hektārā' },
]
onMounted(async () => {
  codifierStore.$patch({
    codifierTypeCodes: [Codifiers.OperationTypes],
  });
  await codifierStore.fetchByFilters();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <BInputGroup prepend="Aprēķināt" class="w-fit-content">
        <BFormSelect :options="calculatePerOptions" v-model="selectedCalculatePer" />
      </BInputGroup>
    </div>
    <div class="row">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
        <caption>
          <h5 class="text-center fw-bold text-black">Īpašuma izmaksu novērtējums</h5>
        </caption>
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh>Apstrādes lauks</BTh>
            <BTh>Lauka platība, ha</BTh>
            <BTh>Veiktās darba stundas, h</BTh>
            <BTh>Kapitāla atgūšanas vērtība, {{ selectedCalculatePer }}</BTh>
            <BTh>Citas izmaksas (Apdrošināšana, pajumte u.c), {{ selectedCalculatePer }}</BTh>
            <BTh>Kopējās īpašumtiesības izmaksas, {{ selectedCalculatePer }}</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in farmlandStore.items" v-bind:key="row.id">
            <BTd>
              {{ `${row?.product_name ?? 'Lauks'} (${(row?.area ?? 0).toFixed(2)} ha)` }}
            </BTd>
            <BTd>
              {{ row.landArea.toFixed(2) }}
            </BTd>
            <BTd>
              {{ sumBy(row.operations, item => item.operationWorkHours).toFixed(2) }}
            </BTd>
            <BTd>
              {{ sumBy(row.operations, item => item.capitalRecoveryValue(selectedCalculatePer)).toFixed(2) }}
            </BTd>
            <BTd>
              {{ sumBy(row.operations, item => item.taxesAndInsuranceCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
            <BTd>
              {{ sumBy(row.operations, item => item.totalOwnershipCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
          </BTr>
          <BTr>
            <BTd class="fw-bold">Kopā</BTd>
            <BTd class="fw-bold">
              {{ sumBy(operationStore.items, item => item.farmland?.area ?? 0).toFixed(2) }}
            </BTd>
            <BTd class="fw-bold">
              {{ sumBy(operationStore.items, item => item.operationWorkHours).toFixed(2) }}
            </BTd>
            <BTd class="fw-bold">
              {{ sumBy(operationStore.items, item => item.capitalRecoveryValue(selectedCalculatePer)).toFixed(2) }}
            </BTd>
            <BTd class="fw-bold">
              {{ sumBy(operationStore.items, item => item.taxesAndInsuranceCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
            <BTd class="fw-bold">
              {{ sumBy(operationStore.items, item => item.totalOwnershipCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
          </BTr>
        </BTbody>
      </BTableSimple>
    </div>
    <div class="row">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
        <caption>
          <h5 class="text-center fw-bold text-black">Ekspluatācijas izmaksu novērtējums</h5>
        </caption>
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh>Apstrādes lauks</BTh>
            <BTh>Lauka platība, ha</BTh>
            <BTh>Veiktās darba stundas, h</BTh>
            <BTh>Degvielas izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Smērvielu izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Remonta izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Darbaspēka izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Kopējās izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in farmlandStore.items" v-bind:key="row.id">
            <BTd>
              {{ `${row?.product_name ?? 'Lauks'} (${(row?.area ?? 0).toFixed(2)} ha)` }}
            </BTd>
            <BTd>
              {{ row.landArea.toFixed(2) }}
            </BTd>
            <BTd>
              {{ sumBy(row.operations, item => item.operationWorkHours).toFixed(2) }}
            </BTd>
            <BTd>
              {{ sumBy(row.operations, item => item.totalFuelCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
            <BTd>
              {{ sumBy(row.operations, item => item.lubricationCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
            <BTd>
              {{ sumBy(row.operations, item => item.accumulatedRepairCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
            <BTd>
              {{ sumBy(row.operations, item => item.equipmentOperatorWageCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
            <BTd>
              {{ sumBy(row.operations, item => item.totalOperatingCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
          </BTr>
          <BTr>
            <BTd class="fw-bold">Kopā</BTd>
            <BTd class="fw-bold">
              {{ sumBy(operationStore.items, item => item.farmland?.area ?? 0).toFixed(2) }}
            </BTd>
            <BTd class="fw-bold">
              {{ sumBy(operationStore.items, item => item.operationWorkHours).toFixed(2) }}
            </BTd>
            <BTd class="fw-bold">
              {{ sumBy(operationStore.items, item => item.totalFuelCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
            <BTd class="fw-bold">
              {{ sumBy(operationStore.items, item => item.lubricationCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
            <BTd class="fw-bold">
              {{ sumBy(operationStore.items, item => item.accumulatedRepairCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
            <BTd class="fw-bold">
              {{ sumBy(operationStore.items, item => item.equipmentOperatorWageCosts(selectedCalculatePer)).toFixed(2) }}
            </BTd>
            <BTd class="fw-bold">
              {{ sumBy(operationStore.items, item => item.totalOperatingCosts(selectedCalculatePer)).toFixed(2) }}
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
