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
          <h5 class="text-center fw-bold text-black">Īpašuma izmaksu novērtējums, EUR</h5>
        </caption>
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh>Tehnikas vienība</BTh>
            <BTh>Atlikusī vērtība</BTh>
            <BTh>Amortizācija gadā</BTh>
            <BTh>Kapitāla atgūšanas vērtība</BTh>
            <BTh>Nodokļi, apdrošināšana un uzturēšana</BTh>
            <BTh>Kopējās īpašuma izmaksas</BTh>
            <BTh>Kopējās īpašuma izmaksas stundā</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in equipmentCollectionStore.models" v-bind:key="row.id">
            <BTd>
              {{ row.equipment_type?.name }} - {{ row.manufacturer }} {{ row.model }} {{ equipmentCollectionStore.getPowerOrRequiredPower(row) }}
            </BTd>
            <BTd class="text-center user-select-none">
              {{ row.remainingValue.toFixed(2) }}&nbsp;EUR&nbsp;<BBadge class="cursor-pointer" @click="onOpenRemainingValueRates(row.remainingValueRate)">{{ (row.remainingValueRate * 100).toFixed(2) }} %</BBadge>
            </BTd>
            <BTd class="text-center user-select-none">
              {{ (row.depreciationValue / row.totalUsageYears).toFixed(2) }}&nbsp;EUR/gadā
            </BTd>
            <BTd class="text-center user-select-none">
              {{ row.capitalRecoveryValue(indicatorStore.getCapitalRecoveryFactor(row.totalUsageYears), indicatorStore.realInterestRate).toFixed(2) }}&nbsp;EUR&nbsp;<BBadge>{{ (indicatorStore.getCapitalRecoveryFactor(row.totalUsageYears) * 100).toFixed(2) }} %</BBadge>
            </BTd>
            <BTd class="text-center user-select-none">
              {{ row.taxesAndInsuranceCostValue(farmInformationStore.otherExpensesPercentage).toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none">
              {{ row.totalExpenses(indicatorStore.getCapitalRecoveryFactor(row.totalUsageYears), indicatorStore.realInterestRate, farmInformationStore.otherExpensesPercentage).toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none">
              {{ row.totalExpensesPerHour(indicatorStore.getCapitalRecoveryFactor(row.totalUsageYears), indicatorStore.realInterestRate, farmInformationStore.otherExpensesPercentage).toFixed(2) }}&nbsp;EUR/h
            </BTd>
          </BTr>
        </BTbody>
      </BTableSimple>
    </div>
    <div class="row">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
        <caption>
          <h5 class="text-center fw-bold text-black">Īpašuma izmaksu novērtējums, EUR</h5>
        </caption>
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh>Tehnikas vienība</BTh>
            <BTh>Tehnikas tips</BTh>
            <BTh>Jauda</BTh>
            <BTh>Nepieciešamā jauda</BTh>
            <BTh>Darba platums</BTh>
            <BTh>&nbsp;</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in equipmentCollectionStore.models" v-bind:key="row.id">
            <BTd>
              {{ row.equipment_type?.name }} - {{ row.manufacturer }} {{ row.model }} {{ equipmentCollectionStore.getPowerOrRequiredPower(row) }}
            </BTd>
            <BTd>

            </BTd>
            <BTd class="text-center">
              {{ row.specifications.power ? `${row.specifications.power?.toFixed(2)} kw` : '' }}
            </BTd>
            <BTd class="text-center">
              {{ row.specifications.required_power ? `${row.specifications.required_power?.toFixed(2)} kw` : '' }}
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
</style>
