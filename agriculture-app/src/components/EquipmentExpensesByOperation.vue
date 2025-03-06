<script setup lang="ts">
  import { BTableSimple, BTbody, BTd, BTh, BThead, BTr, BFormSelect, BInputGroup } from 'bootstrap-vue-next'
  import { onMounted, ref } from 'vue'
  import { useOperationStore } from '@/stores/operation.ts'
  import { useCodifierStore } from '@/stores/codifier.ts'
  import { Codifiers } from '@/stores/enums/Codifiers.ts'
  import {v4 as uuid} from 'uuid'
  import { DisplayNumber, sumBy } from '@/utils.ts'
  import CollapsableTr from '@/components/table/CollapsableTr.vue'
  import SumTd from '@/components/table/SumTd.vue'
  import type { OperationModel } from '@/stores/model/operationModel.ts'

  const operationStore = useOperationStore();
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
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
        <BThead class="position-sticky top-0 bg-primary in-front">
          <BTr>
            <BTh colspan="7">
              <h5 class="text-center fw-bold text-black">Patstāvīgo izmaksu novērtējums</h5>
            </BTh>
          </BTr>
          <BTr>
            <BTh>&nbsp;</BTh>
            <BTh>Apstrādes operācija</BTh>
            <BTh>Apstrādātā platība, ha</BTh>
            <BTh>Veiktās darba stundas, h</BTh>
            <BTh>Finanšu resursu izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Citas izmaksas (Apdrošināšana u.c), EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Patstāvīgās izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <CollapsableTr v-for="(row, key) in operationStore.groupedByOperationCode" v-bind:key="key">
            <template #default>
              <BTd class="text-start align-middle">
                {{ codifierStore.getByCode(key)?.name ?? key }}
              </BTd>
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.farmland?.landArea ?? 0" />
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.operationWorkHours" />
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.capitalRecoveryValue(selectedCalculatePer)" />
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.taxesAndInsuranceCosts(selectedCalculatePer)" />
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.totalOwnershipCosts(selectedCalculatePer)" />
            </template>
            <template #collapsed>
              <BTr v-for="operation in row" v-bind:key="operation.id">
                <BTd colspan="3" class="text-end fw-bold align-middle whitespace-nowrap">
                  {{ operation.displayName }}, {{ operation.machine?.manufacturerModel ?? operation.tractorOrCombine?.manufacturerModel ?? 'Nav tehnikas' }}
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
            <BTd colspan="2" class="fw-bold text-end align-middle whitespace-nowrap">Kopā</BTd>
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.farmland?.landArea ?? 0" />
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.operationWorkHours" />
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.capitalRecoveryValue(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.taxesAndInsuranceCosts(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.totalOwnershipCosts(selectedCalculatePer)" />
          </BTr>
        </BTbody>
      </BTableSimple>
    </div>
    <div class="row">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh colspan="10">
              <h5 class="text-center fw-bold text-black">Eksplautācijas izmaksu novērtējums</h5>
            </BTh>
          </BTr>
          <BTr>
            <BTh>&nbsp;</BTh>
            <BTh>Apstrādes operācija</BTh>
            <BTh>Apstrādātā platība, ha</BTh>
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
          <CollapsableTr v-for="(row, key) in operationStore.groupedByOperationCode" v-bind:key="key">
            <template #default>
              <BTd class="text-start align-middle">
                {{ codifierStore.getByCode(key)?.name ?? key }}
              </BTd>
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.farmland?.landArea ?? 0" />
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.operationWorkHours" />
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.depreciationValue(selectedCalculatePer)" />
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.totalFuelCosts(selectedCalculatePer)" />
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.lubricationCosts(selectedCalculatePer)" />
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.accumulatedRepairCosts(selectedCalculatePer)" />
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.equipmentOperatorWageCosts(selectedCalculatePer)" />
              <SumTd :items="row" :get-prop="(item: OperationModel) => item.totalOperatingCosts(selectedCalculatePer)" />
            </template>
            <template #collapsed>
              <BTr v-for="operation in row" v-bind:key="operation.id">
                <BTd colspan="3" class="text-end fw-bold align-middle whitespace-nowrap">
                  {{ operation.displayName }}, {{ operation.machine?.manufacturerModel ?? operation.tractorOrCombine?.manufacturerModel ?? 'Nav tehnikas' }}
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
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.farmland?.landArea ?? 0" />
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.operationWorkHours" />
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.depreciationValue(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.totalFuelCosts(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.lubricationCosts(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.accumulatedRepairCosts(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.equipmentOperatorWageCosts(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="operationStore.items" :get-prop="(item: OperationModel) => item.totalOperatingCosts(selectedCalculatePer)" />
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
