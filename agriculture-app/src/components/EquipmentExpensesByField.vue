<script setup lang="ts">
import { BTableSimple, BTbody, BTd, BTh, BThead, BTr, BFormSelect, BInputGroup } from 'bootstrap-vue-next'
import {ref, watch} from 'vue'
import { useOperationStore } from '@/stores/operation.ts'
import { DisplayNumber } from '@/utils.ts'
import { useFarmlandStore } from '@/stores/farmland.ts'
import SumCollectionTd from '@/components/table/SumTd.vue'
import type { OperationModel } from '@/stores/model/operationModel.ts'
import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'
import CollapsableTr from '@/components/table/CollapsableTr.vue'
import {useFarmInformationStore} from "@/stores/farmInformation.ts";

const operationStore = useOperationStore();
const farmlandStore = useFarmlandStore();
const farmlandInfoStore = useFarmInformationStore();
const selectedCalculatePer = ref<string>('kopā');
const calculatePerOptions = [
  { value: 'kopā', text: 'kopā' },
  { value: 'h', text: 'stundā' },
  { value: 'ha', text: 'hektārā' },
  { value: 'gads', text: 'gadā' },
];


watch(selectedCalculatePer, () => {
  farmlandStore.yearFilter = undefined;
});
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col d-flex flex-row gap-2">
        <BInputGroup prepend="Aprēķināt" class="w-fit-content">
          <BFormSelect :options="calculatePerOptions" v-model="selectedCalculatePer" />
        </BInputGroup>
        <BInputGroup v-if="selectedCalculatePer === 'gads'" prepend="Filtrēt pēc gada" class="w-fit-content">
          <BFormSelect :options="farmlandInfoStore.farmlandYearOptions" v-model="farmlandStore.yearFilter" />
        </BInputGroup>
      </div>
    </div>
    <div class="row">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
        <BThead class="position-sticky top-0 bg-primary in-front">
          <BTr>
            <BTh colspan="7">
              <h5 v-if="farmlandStore.yearFilter" class="text-center fw-bold text-black">Patstāvīgo izmaksu novērtējums - {{ farmlandStore.yearFilter }} gadam</h5>
              <h5 v-else class="text-center fw-bold text-black">Patstāvīgo izmaksu novērtējums</h5>
            </BTh>
          </BTr>
          <BTr>
            <BTh>&nbsp;</BTh>
            <BTh>Apstrādes lauks</BTh>
            <BTh>Lauka platība, ha</BTh>
            <BTh>Veiktās darba stundas, h</BTh>
            <BTh>Finanšu resursu izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Citas izmaksas (Apdrošināšana u.c), EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Patstāvīgās izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <CollapsableTr v-for="row in farmlandStore.filteredItems" v-bind:key="row.id">
            <template #default>
              <BTd class="text-start align-middle">
                {{ row.displayName }}
              </BTd>
              <BTd class="text-start align-middle">
                {{ DisplayNumber(row.landArea) }}
              </BTd>
              <SumCollectionTd :items="row.operations" :get-prop="(item: OperationModel) => item.operationWorkHours" />
              <SumCollectionTd :items="row.operations" :get-prop="(item: OperationModel) => item.capitalRecoveryValue(selectedCalculatePer)" />
              <SumCollectionTd :items="row.operations" :get-prop="(item: OperationModel) => item.taxesAndInsuranceCosts(selectedCalculatePer)" />
              <SumCollectionTd :items="row.operations" :get-prop="(item: OperationModel) => item.totalOwnershipCosts(selectedCalculatePer)" />
            </template>
            <template #collapsed>
              <BTr v-for="operation in row.operations" v-bind:key="operation.id">
                <BTd colspan="3" class="text-end fw-bold align-middle whitespace-nowrap">
                  {{ operation.displayName }}, {{ operation.equipmentOrExternalServiceDisplayName }}
                </BTd>
                <BTd class="text-start align-middle">
                  {{ DisplayNumber(operation.operationWorkHours) }}
                </BTd>
                <BTd class="text-start align-middle">
                  {{ DisplayNumber(operation.capitalRecoveryValue(selectedCalculatePer)) }}
                </BTd>
                <BTd class="text-start align-middle">
                  {{ DisplayNumber(operation.taxesAndInsuranceCosts(selectedCalculatePer)) }}
                </BTd>
                <BTd class="text-start align-middle">
                  {{ DisplayNumber(operation.totalOwnershipCosts(selectedCalculatePer)) }}
                </BTd>
              </BTr>
            </template>
          </CollapsableTr>
          <BTr>
            <BTd colspan="2" class="fw-bold text-end align-middle">Kopā</BTd>
            <SumCollectionTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.landArea" />
            <SumCollectionTd class="fw-bold" :items="operationStore.filteredItems" :get-prop="(item: OperationModel) => item.operationWorkHours" />
            <SumCollectionTd class="fw-bold" :items="operationStore.filteredItems" :get-prop="(item: OperationModel) => item.capitalRecoveryValue(selectedCalculatePer)" />
            <SumCollectionTd class="fw-bold" :items="operationStore.filteredItems" :get-prop="(item: OperationModel) => item.taxesAndInsuranceCosts(selectedCalculatePer)" />
            <SumCollectionTd class="fw-bold" :items="operationStore.filteredItems" :get-prop="(item: OperationModel) => item.totalOwnershipCosts(selectedCalculatePer)" />
          </BTr>
        </BTbody>
      </BTableSimple>
    </div>
    <div class="row">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
        <BThead class="position-sticky top-0 bg-primary in-front">
          <BTr>
            <BTh colspan="10">
              <h5 v-if="farmlandStore.yearFilter" class="text-center fw-bold text-black">Eksplautācijas izmaksu novērtējums - {{ farmlandStore.yearFilter }} gadam</h5>
              <h5 v-else class="text-center fw-bold text-black">Eksplautācijas izmaksu novērtējums</h5>
            </BTh>
          </BTr>
          <BTr>
            <BTh>&nbsp;</BTh>
            <BTh>Apstrādes lauks</BTh>
            <BTh>Lauka platība, ha</BTh>
            <BTh>Veiktās darba stundas, h</BTh>
            <BTh>Amortizācija, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Degvielas izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Smērvielu izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Remonta izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Darbaspēka izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Eksplautācijas izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <CollapsableTr v-for="row in farmlandStore.filteredItems" v-bind:key="row.id">
            <template #default>
              <BTd class="text-start align-middle">
                {{ row.displayName }}
              </BTd>
              <BTd class="text-start align-middle">
                {{ DisplayNumber(row.landArea) }}
              </BTd>
              <SumCollectionTd :items="row.operations" :get-prop="(item: OperationModel) => item.operationWorkHours" />
              <SumCollectionTd :items="row.operations" :get-prop="(item: OperationModel) => item.depreciationValue(selectedCalculatePer)" />
              <SumCollectionTd :items="row.operations" :get-prop="(item: OperationModel) => item.totalFuelCosts(selectedCalculatePer)" />
              <SumCollectionTd :items="row.operations" :get-prop="(item: OperationModel) => item.lubricationCosts(selectedCalculatePer)" />
              <SumCollectionTd :items="row.operations" :get-prop="(item: OperationModel) => item.accumulatedRepairCosts(selectedCalculatePer)" />
              <SumCollectionTd :items="row.operations" :get-prop="(item: OperationModel) => item.equipmentOperatorWageCosts(selectedCalculatePer)" />
              <SumCollectionTd :items="row.operations" :get-prop="(item: OperationModel) => item.totalOperatingCosts(selectedCalculatePer)" />
            </template>
            <template #collapsed>
              <BTr v-for="operation in row.operations" v-bind:key="operation.id">
                <BTd colspan="3" class="text-end fw-bold align-middle whitespace-nowrap">
                  {{ operation.displayName }}, {{ operation.equipmentOrExternalServiceDisplayName }}
                </BTd>
                <BTd class="text-start align-middle">
                  {{ DisplayNumber(operation.operationWorkHours) }}
                </BTd>
                <BTd class="text-start align-middle">
                  {{ DisplayNumber(operation.depreciationValue(selectedCalculatePer)) }}
                </BTd>
                <BTd class="text-start align-middle">
                  {{ DisplayNumber(operation.totalFuelCosts(selectedCalculatePer)) }}
                </BTd>
                <BTd class="text-start align-middle">
                  {{ DisplayNumber(operation.lubricationCosts(selectedCalculatePer)) }}
                </BTd>
                <BTd class="text-start align-middle">
                  {{ DisplayNumber(operation.accumulatedRepairCosts(selectedCalculatePer)) }}
                </BTd>
                <BTd class="text-start align-middle">
                  {{ DisplayNumber(operation.equipmentOperatorWageCosts(selectedCalculatePer)) }}
                </BTd>
                <BTd class="text-start align-middle">
                  {{ DisplayNumber(operation.totalOperatingCosts(selectedCalculatePer)) }}
                </BTd>
              </BTr>
            </template>
          </CollapsableTr>
          <BTr>
            <BTd colspan="2" class="fw-bold text-end align-middle">Kopā</BTd>
            <SumCollectionTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.landArea" />
            <SumCollectionTd class="fw-bold" :items="operationStore.filteredItems" :get-prop="(item: OperationModel) => item.operationWorkHours" />
            <SumCollectionTd class="fw-bold" :items="operationStore.filteredItems" :get-prop="(item: OperationModel) => item.depreciationValue(selectedCalculatePer)" />
            <SumCollectionTd class="fw-bold" :items="operationStore.filteredItems" :get-prop="(item: OperationModel) => item.totalFuelCosts(selectedCalculatePer)" />
            <SumCollectionTd class="fw-bold" :items="operationStore.filteredItems" :get-prop="(item: OperationModel) => item.lubricationCosts(selectedCalculatePer)" />
            <SumCollectionTd class="fw-bold" :items="operationStore.filteredItems" :get-prop="(item: OperationModel) => item.accumulatedRepairCosts(selectedCalculatePer)" />
            <SumCollectionTd class="fw-bold" :items="operationStore.filteredItems" :get-prop="(item: OperationModel) => item.equipmentOperatorWageCosts(selectedCalculatePer)" />
            <SumCollectionTd class="fw-bold" :items="operationStore.filteredItems" :get-prop="(item: OperationModel) => item.totalOperatingCosts(selectedCalculatePer)" />
          </BTr>
        </BTbody>
      </BTableSimple>
    </div>

    <div class="row mt-5">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh colspan="6">
              <h5 v-if="farmlandStore.yearFilter" class="text-center fw-bold text-black">Izejvielu izmaksu novērtējums - {{ farmlandStore.yearFilter }} gadam</h5>
              <h5 v-else class="text-center fw-bold text-black">Izejvielu izmaksu novērtējums</h5>
            </BTh>
          </BTr>
          <BTr>
            <BTh>Apstrādes lauks</BTh>
            <BTh>Lauka platība, ha</BTh>
            <BTh>Kopējais sēklas izsējas apjoms, t</BTh>
            <BTh>Sēklas izmaksas, EUR/ha</BTh>
            <BTh>Papildus izejvielu izmaksas, EUR/ha</BTh>
            <BTh>Izejvielu izmaksas, EUR</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in farmlandStore.filteredItems" v-bind:key="row.id">
            <BTd class="text-start align-middle">
              {{ row.displayName }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(row.landArea) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(row.cropUsageTotalTons) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(row.cropCostsPerHectare) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(row.otherAdjustmentCostsPerHectare) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(row.materialCostsTotal) }}
            </BTd>
          </BTr>
          <BTr>
            <BTd class="fw-bold text-end align-middle">Kopā</BTd>
            <SumCollectionTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.landArea" />
            <SumCollectionTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.cropUsageTotalTons" />
            <SumCollectionTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.cropCostsPerHectare" />
            <SumCollectionTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.otherAdjustmentCostsPerHectare" />
            <SumCollectionTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.materialCostsTotal" />
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
.whitespace-nowrap {
  white-space: nowrap !important;
}
</style>
