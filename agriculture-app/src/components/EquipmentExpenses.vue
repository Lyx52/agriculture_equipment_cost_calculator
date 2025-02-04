<script setup lang="ts">
  import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
  import { BTableSimple, BTbody, BTd, BTh, BThead, BTr, BBadge, BPopover } from 'bootstrap-vue-next'
  import { useIndicatorStore } from '@/stores/indicator.ts'
  import { onMounted } from 'vue'
  import { useFarmInformationStore } from '@/stores/farmInformation.ts'
  const indicatorStore = useIndicatorStore();
  onMounted(async () => {
    await indicatorStore.getInflationRate();
    await indicatorStore.getInterestRate();
    await indicatorStore.getConsumerPriceIndices();
    await indicatorStore.getMotorHoursByYear();
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
            <BTh>Iegādes cena</BTh>
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
              {{ row.equipment_type?.name }} - {{ row.manufacturer }} {{ row.model }} {{ equipmentCollectionStore.getPowerOrWorkingWidth(row) }}
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.originalPurchasePrice.toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.remainingValue.toFixed(2) }}&nbsp;EUR&nbsp;<BBadge class="cursor-pointer" @click="onOpenRemainingValueRates(row.remainingValueRate)">{{ (row.remainingValueRate * 100).toFixed(2) }} %</BBadge>
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ (row.depreciationValue / row.totalLifetimeUsageYears).toFixed(2) }}&nbsp;EUR/gadā
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.capitalRecoveryValue().toFixed(2)
              }}&nbsp;EUR&nbsp;
              <BPopover :click="true" :close-on-hide="true" :delay="{show: 0, hide: 0}">
                <template #target>
                  <BBadge class="cursor-pointer">{{ (indicatorStore.getCapitalRecoveryFactor(row.totalLifetimeUsageYears) * 100).toFixed(2) }} %</BBadge>
                </template>
                Kapitāla atgūšanas faktors, tā ir vērtība kuru jāatvēla katru gadu lai atgūtu zaudēto summu amortizācijā, tas ļauj noteikt cik jāpelna ar iekārtu lai atpelnītu investēto naudu eksplautācijas beigās
              </BPopover>
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.taxesAndInsuranceCostValue().toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.totalExpenses().toFixed(2)
              }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.totalExpensesPerHour().toFixed(2)
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
            <BTh class="align-middle text-center">Remonta izmaksas (Atlikušās)</BTh>
            <BTh class="align-middle text-center">Remontdarbu kopsumma</BTh>
            <BTh class="align-middle text-center">Remonta izmaksas stundā</BTh>
            <BTh class="align-middle text-center">Degvielas patēriņš</BTh>
            <BTh class="align-middle text-center">Degvielas izmaksas</BTh>
            <BTh class="align-middle text-center">Smērvielu izmaksas</BTh>
            <BTh class="align-middle text-center">Kopējās izmaksas stundā</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in equipmentCollectionStore.models" v-bind:key="row.id">
            <BTd>
              {{ row.equipment_type?.name }} - {{ row.manufacturer }} {{ row.model }} {{ equipmentCollectionStore.getPowerOrWorkingWidth(row) }}
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.totalCurrentUsageHours.toFixed(2) }}&nbsp;h
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.currentCostOfRepair.toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ (row.lifetimeCostOfRepair - row.currentCostOfRepair).toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.lifetimeCostOfRepair.toFixed(2) }}&nbsp;EUR
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{ row.averageRemainingCostOfRepairPerHour.toFixed(2) }}&nbsp;EUR/h
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              <span v-if="row.isTractorOrCombine">
                {{ row.fuelCostsPerHour().toFixed(2) }}&nbsp;l/h
                <BPopover :click="true" :close-on-hide="true" :delay="{show: 0, hide: 0}">
                  <template #target>
                    <BBadge class="cursor-pointer">80%</BBadge>
                  </template>
                  Degvielas izmaksas tiek aprēķinātas pieņemot ka dzinējs strādā ar <b>80%</b> noslodzi
                </BPopover>
              </span>
              <span v-else>
                -
              </span>
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              <span v-if="row.isTractorOrCombine">
              {{ (row.fuelCostsPerHour() * farmInformationStore.fuelPrice).toFixed(2) }}&nbsp;EUR/h
              </span>
              <span v-else>
                -
              </span>
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              <span v-if="row.isTractorOrCombine">
                {{ ((row.fuelCostsPerHour() * farmInformationStore.fuelPrice) * (farmInformationStore.lubricantExpensesPercentage / 100)).toFixed(2)
                }}&nbsp;EUR/h&nbsp;
                <BPopover :click="true" :close-on-hide="true" :delay="{show: 0, hide: 0}">
                  <template #target>
                    <BBadge class="cursor-pointer">{{ farmInformationStore.lubricantExpensesPercentage }}%</BBadge>
                  </template>
                  <b>{{ farmInformationStore.lubricantExpensesPercentage }}%</b> no degvielas izmaksām, skatīties <b>'Mana saimniecība'</b>
                </BPopover>
              </span>
              <span v-else>
                -
              </span>
            </BTd>
            <BTd class="text-center user-select-none vertical-align-middle">
              {{
                (
                  ((row.fuelCostsPerHour() * farmInformationStore.fuelPrice) * (farmInformationStore.lubricantExpensesPercentage / 100)) +
                  (row.fuelCostsPerHour() * farmInformationStore.fuelPrice) +
                  row.averageRemainingCostOfRepairPerHour
                ).toFixed(2)
              }}&nbsp;EUR/h
              <BPopover :click="true" :close-on-hide="true" :delay="{show: 0, hide: 0}">
                <template #target>
                  <BBadge class="cursor-pointer" v-if="row.isTractorOrCombine">+{{ farmInformationStore.employeeWage }} EUR/h</BBadge>
                </template>
                Darbinieka atalgojums, skatīties <b>'Mana saimniecība'</b>
              </BPopover>

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
