<script setup lang="ts">
import {
  BFormInput,
  BFormGroup,
  BInputGroup,
  BButton,
  useModalController,
  BBadge,
  BAccordion, BAccordionItem
} from 'bootstrap-vue-next'
import BNumericFormInput from '@/components/elements/BNumericFormInput.vue'
import { useFarmInformationStore } from '@/stores/farmInformation.ts'
import { useIndicatorStore } from '@/stores/indicator.ts'
import { onMounted } from 'vue'
import { PowerFilterMax } from '@/constants/EquipmentFilterConstants.ts'
import VueSlider from 'vue-3-slider-component'
const farmInformationStore = useFarmInformationStore();
const {confirm} = useModalController();
const indicatorStore = useIndicatorStore();
onMounted(async () => {
  await indicatorStore.getInflationRate();
  await indicatorStore.getInterestRate();
  await indicatorStore.getConsumerPriceIndices();
  await indicatorStore.getMotorHoursByYear();
});
const onClearStores = async () => {
  const confirmed = await confirm?.({
    props: {
      title: 'Vai tiešām dzēst saimniecības datus?',
      cancelTitle: 'Atcelt',
      okTitle: 'Dzēst',
      okVariant: 'danger',
    }
  });
  if (confirmed) {
    localStorage.clear();
    window.location.reload();
  }
}
</script>

<template>
  <div class="container-fluid">
    <div class="row row-cols-2">
      <div class="col">
        <BFormGroup label="Saimniecības nosaukums" class="mt-2">
          <BFormInput v-model="farmInformationStore.name" />
        </BFormGroup>
        <BAccordion class="mt-3" >
          <BAccordionItem title="Noklusētās vērtības"  body-class="mb-3">
            <BFormGroup label="Darbaspēka atalgojums" class="mt-2">
              <BInputGroup append="EUR/h">
                <BNumericFormInput v-model="farmInformationStore.employeeWage" />
              </BInputGroup>
            </BFormGroup>
            <BFormGroup label="Citas izmaksas (Apdrošināšana, pajumtes uzturēšana u.c)" class="mt-2">
              <BInputGroup append="%">
                <BNumericFormInput v-model="farmInformationStore.otherExpensesPercentage" />
              </BInputGroup>
            </BFormGroup>
            <BFormGroup label="Smērvielu izdevumi no degv. izmaksām" class="mt-2">
              <BInputGroup append="%">
                <BNumericFormInput v-model="farmInformationStore.lubricantExpensesPercentage" />
              </BInputGroup>
            </BFormGroup>
            <BFormGroup label="Degvielas izmaksas" class="mt-2">
              <BInputGroup append="EUR/l">
                <BNumericFormInput v-model="farmInformationStore.fuelPrice" />
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
            <p>Reālā procentu likme: {{ indicatorStore.realInterestRate.toFixed(2) }} %</p>
          </BAccordionItem>
        </BAccordion>
      </div>
      <div class="col d-flex flex-column mt-2">
        <BButton variant="danger" class="ms-auto" @click="onClearStores">Dzēst saimniecības datus</BButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
