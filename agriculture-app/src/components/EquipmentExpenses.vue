<script setup lang="ts">
  import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
  import { BButton, BButtonGroup, BTableSimple, BTbody, BTd, BTfoot, BTh, BThead, BTr, BBadge } from 'bootstrap-vue-next'
  import { useIndicatorStore } from '@/stores/indicator.ts'
  import { onMounted } from 'vue'
  import { useFarmInformationStore } from '@/stores/farmInformation.ts'
  const indicatorStore = useIndicatorStore();
  onMounted(async () => {
    await indicatorStore.getInflationRate();
    await indicatorStore.getInterestRate();
  });
  const farmInformationStore = useFarmInformationStore();
  const equipmentCollectionStore = useEquipmentCollectionStore();
  const onOpenRemainingValueRates = (value: number) => {
    console.log(value)
  }
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
        <caption>
          <h5 class="text-center fw-bold text-black">Īpašuma izmaksu novērtējums</h5>
        </caption>
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh>Tehnikas vienība</BTh>
            <BTh>Atlikusī vērtība</BTh>
            <BTh>Amortizācija gadā</BTh>
            <BTh>Kapitāla atgūšanas vērtība</BTh>
            <BTh>Nodokļi, apdrošināšana un uzturēšana</BTh>
            <BTh>Kopējās izmaksas</BTh>
            <BTh>Kopējās izmaksas stundā</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in equipmentCollectionStore.models" v-bind:key="row.id">
            <BTd>
              {{ row.equipment_type?.name }} - {{ row.manufacturer }} {{ row.model }} {{ equipmentCollectionStore.getPowerOrRequiredPower(row) }}
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.remainingValue.toFixed(2) }}&nbsp;EUR&nbsp;<BBadge class="cursor-pointer" @click="onOpenRemainingValueRates(row.remainingValueRate)">{{ (row.remainingValueRate * 100).toFixed(2) }} %</BBadge>
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ (row.depreciationValue / row.totalLifetimeUsageYears).toFixed(2) }}&nbsp;EUR/gadā
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.capitalRecoveryValue(indicatorStore.getCapitalRecoveryFactor(row.totalLifetimeUsageYears), indicatorStore.realInterestRate).toFixed(2)
              }}&nbsp;EUR&nbsp;<BBadge>{{ (indicatorStore.getCapitalRecoveryFactor(row.totalLifetimeUsageYears) * 100).toFixed(2)
              }} %</BBadge>
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.taxesAndInsuranceCostValue(farmInformationStore.otherExpensesPercentage).toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.totalExpenses(indicatorStore.getCapitalRecoveryFactor(row.totalLifetimeUsageYears), indicatorStore.realInterestRate, farmInformationStore.otherExpensesPercentage).toFixed(2)
              }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.totalExpensesPerHour(indicatorStore.getCapitalRecoveryFactor(row.totalLifetimeUsageYears), indicatorStore.realInterestRate, farmInformationStore.otherExpensesPercentage).toFixed(2)
              }}&nbsp;EUR/h
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
            <BTh class="align-middle text-center">Tehnikas vienība</BTh>
            <BTh class="align-middle text-center">Uzkrātās stundas</BTh>
            <BTh class="align-middle text-center">Remonta izmaksas (Pašreizējās)</BTh>
            <BTh class="align-middle text-center">Remonta izmaksas (Kalpošanas beigās)</BTh>
            <BTh class="align-middle text-center">Remontdarbu kopsumma</BTh>
            <BTh class="align-middle text-center">Remonta izmaksas stundā</BTh>
            <BTh class="align-middle text-center">Degvielas patēriņš</BTh>
            <BTh class="align-middle text-center">Degvielas izmaksas</BTh>
            <BTh class="align-middle text-center">Smērvielu izmaksas</BTh>
            <BTh class="align-middle text-center">Kopējās izmaksas</BTh>
            <BTh class="align-middle text-center">Kopējās izmaksas stundā</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in equipmentCollectionStore.models" v-bind:key="row.id">
            <BTd>
              {{ row.equipment_type?.name }} - {{ row.manufacturer }} {{ row.model }} {{ equipmentCollectionStore.getPowerOrRequiredPower(row) }}
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.totalCurrentUsageHours.toFixed(2) }}&nbsp;h
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.currentCostOfRepair.toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.lifetimeCostOfRepair.toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd>
              {{ row.specifications.required_power ? `${row.specifications.work_width?.toFixed(2)} m` : '' }}
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
</style>
