<script setup lang="ts">
import {
  BFormInput,
  BFormGroup,
  BInputGroup,
  BBadge,
  BAccordion,
  BAccordionItem, BSpinner
} from 'bootstrap-vue-next'
import BNumericFormInput from '@/components/elements/BNumericFormInput.vue'
import { useFarmInformationStore } from '@/stores/farmInformation.ts'
import { useIndicatorStore } from '@/stores/indicator.ts'
import { useAuthStore } from '@/stores/auth.ts'
import CostsBreakdownChart from '@/components/charts/CostsBreakdownChart.vue'
const farmInformationStore = useFarmInformationStore();
const indicatorStore = useIndicatorStore();

const onInformationChange = async () => {
  await farmInformationStore.updateFarmInformationAsync();
}
</script>

<template>
  <div class="d-flex flex-grow-1">
    <div class="row row-cols-2 w-100">
      <div class="col">

        <BFormGroup label="Saimniecības nosaukums" class="mt-2">
          <BSpinner v-if="farmInformationStore.isLoading" />
          <BFormInput v-if="!farmInformationStore.isLoading" v-model="farmInformationStore.farm_name" @change="onInformationChange" />
        </BFormGroup>
        <BAccordion class="mt-3" >
          <BAccordionItem title="Noklusētās vērtības"  body-class="mb-3">
            <BSpinner v-if="farmInformationStore.isLoading" />
            <BFormGroup label="Darbaspēka atalgojums (Noklusētā darba alga, ja nav ievadīti darbinieki)" class="mt-2">
              <BInputGroup append="EUR/h">
                <BNumericFormInput v-model="farmInformationStore.default_wage" @change="onInformationChange" />
              </BInputGroup>
            </BFormGroup>
            <BFormGroup label="Citas izmaksas (Apdrošināšana u.c)" class="mt-2">
              <BInputGroup append="%">
                <BNumericFormInput v-model="farmInformationStore.other_expenses_percentage" @change="onInformationChange" />
              </BInputGroup>
            </BFormGroup>
            <BFormGroup label="Smērvielu izdevumi no degv. izmaksām" class="mt-2">
              <BInputGroup append="%">
                <BNumericFormInput v-model="farmInformationStore.lubrication_costs_percentage" @change="onInformationChange" />
              </BInputGroup>
            </BFormGroup>
            <BFormGroup label="Degvielas izmaksas" class="mt-2">
              <BInputGroup append="EUR/l">
                <BNumericFormInput v-model="farmInformationStore.fuel_cost_per_liter" @change="onInformationChange" />
              </BInputGroup>
            </BFormGroup>
            <BFormGroup class="mt-2">
              <template #label>
                Aizņemšanās procentu likme <BBadge><a class="text-white text-decoration-none" href="https://data.ecb.europa.eu/data/datasets/MIR/MIR.M.U2.B.A2I.AM.R.A.2240.EUR.N">Avots (Atjaunots {{ indicatorStore.interestRate.period }})</a></BBadge>
              </template>
              <BInputGroup append="%">
                <BNumericFormInput v-model="indicatorStore.interestRate.value" />
              </BInputGroup>
            </BFormGroup>
            <BFormGroup class="mt-2">
              <template #label>
                Inflācijas likme <BBadge><a class="text-white text-decoration-none" href="https://data.ecb.europa.eu/data/datasets/ICP/ICP.M.LV.N.000000.4.ANR">Avots (Atjaunots {{ indicatorStore.inflationRate.period }})</a></BBadge>
              </template>
              <BInputGroup append="%">
                <BNumericFormInput v-model="indicatorStore.inflationRate.value" />
              </BInputGroup>
            </BFormGroup>
            <p>Reālā procentu likme: {{ (indicatorStore.realInterestRate * 100).toFixed(2) }} %</p>
          </BAccordionItem>
        </BAccordion>
      </div>
      <div class="col">
        <CostsBreakdownChart />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
