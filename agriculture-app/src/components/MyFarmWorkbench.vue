<script setup lang="ts">
import { BFormInput, BFormGroup, BInputGroup, BButton, useModalController, BBadge } from 'bootstrap-vue-next'
import BNumericFormInput from '@/components/elements/BNumericFormInput.vue'
import { useFarmInformationStore } from '@/stores/farmInformation.ts'
import { useIndicatorStore } from '@/stores/indicator.ts'
import { onMounted } from 'vue'
const farmInformationStore = useFarmInformationStore();
const {confirm} = useModalController();
const indicatorStore = useIndicatorStore();
onMounted(async () => {
  await indicatorStore.getInflationRate();
  await indicatorStore.getInterestRate();
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
  console.log(confirmed)
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
        <BFormGroup label="Saimniecības nosaukums">
          <BFormInput v-model="farmInformationStore.name" />
        </BFormGroup>
        <BFormGroup label="Darbaspēka atalgojums">
          <BInputGroup append="EUR/h">
            <BNumericFormInput v-model="farmInformationStore.employeeWage" />
          </BInputGroup>
        </BFormGroup>
        <BFormGroup label="Citas izmaksas (Apdrošināšana, pajumtes uzturēšana u.c)">
          <BInputGroup append="%">
            <BNumericFormInput v-model="farmInformationStore.otherExpensesPercentage" />
          </BInputGroup>
        </BFormGroup>
        <BFormGroup label="Smērvielu izdevumi no degv. izmaksām">
          <BInputGroup append="%">
            <BNumericFormInput v-model="farmInformationStore.lubricantExpensesPercentage" />
          </BInputGroup>
        </BFormGroup>
        <BFormGroup>
          <template #label>
            Aizņemšanās procentu likme <BBadge><a class="text-white text-decoration-none" href="https://data.ecb.europa.eu/data/datasets/MIR/MIR.M.U2.B.A2I.AM.R.A.2240.EUR.N">Avots (Atjaunots {{ indicatorStore.interestRate.period }})</a></BBadge>
          </template>
          <BInputGroup append="%">
            <BNumericFormInput v-model="indicatorStore.interestRate.value" />
          </BInputGroup>

        </BFormGroup>
        <BFormGroup>
          <template #label>
            Inflācijas likme <BBadge><a class="text-white text-decoration-none" href="https://data.ecb.europa.eu/data/datasets/ICP/ICP.M.LV.N.000000.4.ANR">Avots (Atjaunots {{ indicatorStore.inflationRate.period }})</a></BBadge>
          </template>
          <BInputGroup append="%">
            <BNumericFormInput v-model="indicatorStore.inflationRate.value" />
          </BInputGroup>
        </BFormGroup>
        <p>Reālā procentu likme: {{ indicatorStore.realInterestRate.toFixed(2) }} %</p>
      </div>
      <div class="col d-flex flex-column">
        <BButton variant="danger" class="ms-auto" @click="onClearStores">Dzēst saimniecības datus</BButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
