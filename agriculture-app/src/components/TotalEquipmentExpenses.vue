<script setup lang="ts">
  import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
  import { BTableSimple, BTbody, BTd, BTh, BThead, BTr, BBadge, BFormSelect, BInputGroup } from 'bootstrap-vue-next'
  import { ref } from 'vue'
  import { DisplayNumber } from '../utils.ts'
  import type { EquipmentModel } from '@/stores/model/equipmentModel.ts'
  import SumTd from '@/components/table/SumTd.vue'
  const selectedCalculatePer = ref<string>('gadā');
  const calculatePerOptions = [
    { value: 'kopā', text: 'kopā' },
    { value: 'gadā', text: 'gadā' },
    { value: 'h', text: 'stundā' }
  ]
  const equipmentCollectionStore = useEquipmentCollectionStore();
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
            <BTh colspan="10">
              <h5 class="text-center fw-bold text-black">Patstāvīgo izmaksu novērtējums</h5>
            </BTh>
          </BTr>
          <BTr>
            <BTh>Tehnikas vienība</BTh>
            <BTh>Tehnikas vecums</BTh>
            <BTh>Iegādes cena, EUR</BTh>
            <BTh>Pašreizējā cena (Līdzvērtīgas tehnikas), EUR</BTh>
            <BTh>Atgūstamā vērtība, EUR</BTh>
            <BTh>Amortizācijas kopsumma</BTh>
            <BTh>Amortizācija, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Finanšu resursu izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Citas izmaksas (Apdrošināšana u.c), EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Patstāvīgās izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in equipmentCollectionStore.items" v-bind:key="row.id">
            <BTd class="text-start align-middle">
              {{ row.displayName }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ row.totalCurrentUsageYears }}&nbsp;gadi ({{ row.totalCurrentUsageHours }}&nbsp;stundas)
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.originalPurchasePrice) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.inflationAdjustedPurchasePrice) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.salvageValue) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.totalDepreciationValue) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.depreciationValue(selectedCalculatePer)) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.capitalRecoveryValue(selectedCalculatePer)) }} <BBadge class="cursor-pointer">{{ (row.capitalRecoveryCoefficient * 100).toFixed(2) }} %</BBadge>
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.taxesAndInsuranceCostValue(selectedCalculatePer)) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.totalOwnershipCost(selectedCalculatePer)) }}
            </BTd>
          </BTr>
          <BTr class="fw-bold">
            <BTd class="text-end user-select-none vertical-align-middle" colspan="2">Kopā</BTd>
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.originalPurchasePrice" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.inflationAdjustedPurchasePrice" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.salvageValue" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.totalDepreciationValue" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.depreciationValue(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.capitalRecoveryValue(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.taxesAndInsuranceCostValue(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.totalOwnershipCost(selectedCalculatePer)" />
          </BTr>
        </BTbody>
      </BTableSimple>
    </div>
    <div class="row mt-4 mb-4">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
        <BThead class="position-sticky top-0 bg-primary in-front">
          <BTr>
            <BTh colspan="9">
              <h5 class="text-center fw-bold text-black">Eksplautācijas izmaksu novērtējums</h5>
            </BTh>
          </BTr>
          <BTr>
            <BTh>Tehnikas vienība</BTh>
            <BTh>Tehnikas vecums</BTh>
            <BTh>Iegādes cena, EUR</BTh>
            <BTh>Pašreizējā cena (Līdzvērtīgas tehnikas), EUR</BTh>
            <BTh>Uzkrātās remonta izmaksas, EUR</BTh>
            <BTh>Remonta izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Degvielas izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Smērvielu izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Eksplautācijas izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in equipmentCollectionStore.items" v-bind:key="row.id">
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ row.displayName }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ row.totalCurrentUsageYears }}&nbsp;gadi ({{ row.totalCurrentUsageHours }}&nbsp;stundas)
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.originalPurchasePrice) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.inflationAdjustedPurchasePrice) }}
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.accumulatedRepairCosts('kopā'), 2, '0.00') }} <BBadge class="cursor-pointer">{{ (row.repairValueFactorCurrent * 100).toFixed(2) }}&nbsp;%</BBadge>
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.accumulatedRepairCosts(selectedCalculatePer), 2, '0.00') }}
            </BTd>
            <BTd v-if="row.isTractorOrCombine" class="text-start user-select-none vertical-align-middle">
              <div class="d-flex gap-1 justify-content-center align-items-center">{{ DisplayNumber(row.fuelCosts(selectedCalculatePer)) }} <BBadge class="cursor-pointer">slodze <br/> 80%</BBadge></div>
            </BTd>
            <BTd v-else class="text-start user-select-none vertical-align-middle">
              &nbsp;-&nbsp;
            </BTd>
            <BTd v-if="row.isTractorOrCombine" class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.lubricationCosts(selectedCalculatePer)) }}
            </BTd>
            <BTd v-else class="text-start user-select-none vertical-align-middle">
              &nbsp;-&nbsp;
            </BTd>
            <BTd class="text-start user-select-none vertical-align-middle">
              {{ DisplayNumber(row.operatingCosts(selectedCalculatePer)) }}
            </BTd>
          </BTr>
          <BTr class="fw-bold">
            <BTd class="text-end user-select-none vertical-align-middle" colspan="2">Kopā</BTd>
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.originalPurchasePrice" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.inflationAdjustedPurchasePrice" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.accumulatedRepairCosts('kopā')" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.accumulatedRepairCosts(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.fuelCosts(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.lubricationCosts(selectedCalculatePer)" />
            <SumTd class="fw-bold" :items="equipmentCollectionStore.items" :get-prop="(item: EquipmentModel) => item.operatingCosts(selectedCalculatePer)" />
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
