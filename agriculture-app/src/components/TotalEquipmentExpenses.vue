<script setup lang="ts">
  import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
  import { BTableSimple, BTbody, BTd, BTh, BThead, BTr, BBadge, BFormSelect, BInputGroup } from 'bootstrap-vue-next'
  import { ref } from 'vue'
  const selectedCalculatePer = ref<string>('gadā');
  const calculatePerOptions = [
    { value: 'gadā', text: 'gadā' },
    { value: 'h', text: 'h' }
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
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
        <caption>
          <h5 class="text-center fw-bold text-black">Īpašuma izmaksu novērtējums</h5>
        </caption>
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh>Tehnikas vienība</BTh>
            <BTh>Tehnikas vecums</BTh>
            <BTh>Iegādes cena</BTh>
            <BTh>Pašreizējā cena</BTh>
            <BTh>Atgūstamā vērtība, EUR</BTh>
            <BTh>Amortizācijas kopsumma</BTh>
            <BTh>Kapitāla atgūšanas vērtība, {{ selectedCalculatePer }}</BTh>
            <BTh>Citas izmaksas (Apdrošināšana, pajumte u.c), {{ selectedCalculatePer }}</BTh>
            <BTh>Kopējās īpašumtiesības izmaksas, {{ selectedCalculatePer }}</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in equipmentCollectionStore.items" v-bind:key="row.id">
            <BTd>
              {{ row.equipment_type?.name }} - {{ row.manufacturer }} {{ row.model }} {{ equipmentCollectionStore.getPowerOrWorkingWidth(row) }}
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.totalCurrentUsageYears }}&nbsp;gadi ({{ row.totalCurrentUsageHours }}&nbsp;stundas)
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.originalPurchasePrice.toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.currentPurchasePrice.toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.salvageValue.toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.totalDepreciationValue.toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ row.capitalRecoveryValuePerYear.toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }} <BBadge class="cursor-pointer">{{ (row.capitalRecoveryCoefficient * 100).toFixed(2) }} %</BBadge>
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ row.capitalRecoveryValuePerHour.toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }} <BBadge class="cursor-pointer">{{ (row.capitalRecoveryCoefficient * 100).toFixed(2) }} %</BBadge>
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ row.taxesAndInsuranceCostValuePerYear.toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ row.taxesAndInsuranceCostValuePerHour.toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ row.totalOwnershipCostPerYear.toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ row.totalOwnershipCostPerHour.toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
          </BTr>
          <BTr class="fw-bold">
            <BTd class="text-end user-select-none vertical-align-middle" colspan="2">Kopā</BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.originalPurchasePrice).toFixed(2) }} EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.currentPurchasePrice).toFixed(2) }} EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.salvageValue).toFixed(2) }} EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.totalDepreciationValue).toFixed(2) }} EUR
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.capitalRecoveryValuePerYear).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.capitalRecoveryValuePerHour).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.taxesAndInsuranceCostValuePerYear).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.taxesAndInsuranceCostValuePerHour).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.totalOwnershipCostPerYear).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.totalOwnershipCostPerHour).toFixed(2) }} EUR/{{ selectedCalculatePer }}
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
            <BTh>Tehnikas vienība</BTh>
            <BTh>Tehnikas vecums</BTh>
            <BTh>Iegādes cena</BTh>
            <BTh>Pašreizējā cena</BTh>
            <BTh>Uzkrātās remonta izmaksas (Eksplautācijas beigās), EUR</BTh>
            <BTh>Remonta izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Degvielas izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Smērvielu izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Darbaspēka izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Kopējās ekspluatācijas izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in equipmentCollectionStore.items" v-bind:key="row.id">
            <BTd>
              {{ row.equipment_type?.name }} - {{ row.manufacturer }} {{ row.model }} {{ equipmentCollectionStore.getPowerOrWorkingWidth(row) }}
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.totalCurrentUsageYears }}&nbsp;gadi ({{ row.totalCurrentUsageHours }}&nbsp;stundas)
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.originalPurchasePrice.toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.currentPurchasePrice.toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.accumulatedRepairsCostValue.toFixed(2) }}&nbsp;EUR ({{ (row.repairValueFactor * 100).toFixed(2) }}&nbsp;%)
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ row.accumulatedRepairsCostPerYear.toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ row.accumulatedRepairsCostPerHour.toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-if="row.isTractorOrCombine && selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ row.fuelCostsPerYearNew().toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else-if="row.isTractorOrCombine" class="text-center user-select-none vertical-align-middle">
              {{ row.fuelCostsPerHourNew().toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              &nbsp;-&nbsp;
            </BTd>
            <BTd v-if="row.isTractorOrCombine && selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ row.lubricationCostsPerYearNew().toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else-if="row.isTractorOrCombine" class="text-center user-select-none vertical-align-middle">
              {{ row.lubricationCostsPerHourNew().toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              &nbsp;-&nbsp;
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ row.equipmentOperatorWageCostPerYear.toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ row.equipmentOperatorWageCostPerHour.toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'"  class="text-center user-select-none vertical-align-middle">
              {{ row.totalOperatingCostsPerYear().toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ row.totalOperatingCostsPerHour().toFixed(2) }}&nbsp;EUR/{{ selectedCalculatePer }}
            </BTd>
          </BTr>
          <BTr class="fw-bold">
            <BTd class="text-end user-select-none vertical-align-middle" colspan="2">Kopā</BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.originalPurchasePrice).toFixed(2) }} EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.currentPurchasePrice).toFixed(2) }} EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.accumulatedRepairsCostValue).toFixed(2) }} EUR
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.accumulatedRepairsCostPerYear).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.accumulatedRepairsCostPerHour).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.fuelCostsPerYearNew()).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.fuelCostsPerHourNew()).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.lubricationCostsPerYearNew()).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.lubricationCostsPerHourNew()).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.equipmentOperatorWageCostPerYear).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.equipmentOperatorWageCostPerHour).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-if="selectedCalculatePer === 'gadā'" class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.totalOperatingCostsPerYear()).toFixed(2) }} EUR/{{ selectedCalculatePer }}
            </BTd>
            <BTd v-else class="text-center user-select-none vertical-align-middle">
              {{ equipmentCollectionStore.equipmentTotalsByProperty(e => e.totalOperatingCostsPerHour()).toFixed(2) }} EUR/{{ selectedCalculatePer }}
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
