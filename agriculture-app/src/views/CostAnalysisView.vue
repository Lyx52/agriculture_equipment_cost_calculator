<script setup lang="ts">

import { BTabs, BTab, BCardBody, BSpinner } from 'bootstrap-vue-next'
import TotalEquipmentExpenses from '@/components/TotalEquipmentExpenses.vue'
import EquipmentExpensesByOperation from '@/components/EquipmentExpensesByOperation.vue'
import EquipmentExpensesByField from '@/components/EquipmentExpensesByField.vue'
import { onMounted, ref } from 'vue'
import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
import { useFarmlandStore } from '@/stores/farmland.ts'
import { useOperationStore } from '@/stores/operation.ts'
import { useIndicatorStore } from '@/stores/indicator.ts'
import { useAdjustmentsStore } from '@/stores/adjustments.ts'
import { useCropsStore } from '@/stores/crops.ts'
import GrossCoverage from '@/components/GrossCoverage.vue'
import CardContainer from '@/components/elements/CardContainer.vue'
const equipmentCollection = useEquipmentCollectionStore();
const farmlandStore = useFarmlandStore();
const operationStore = useOperationStore();
const indicatorStore = useIndicatorStore();
const adjustmentStore = useAdjustmentsStore();
const cropTypeStore = useCropsStore();
const isLoading = ref<boolean>(true);

onMounted(async () => {
  await indicatorStore.getInflationRate();
  await indicatorStore.getInterestRate();
  await indicatorStore.getConsumerPriceIndices();
  await indicatorStore.getMotorHoursByYear();

  await equipmentCollection.fetchByFilters();
  await farmlandStore.fetchByFilters();
  await operationStore.fetchByFilters();
  await adjustmentStore.fetchByFilters();
  await cropTypeStore.fetchByFilters();
  isLoading.value = false;
});


</script>

<template>
  <CardContainer>
    <BCardBody v-if="isLoading" class="text-center">
      <BSpinner v-if="true" />
    </BCardBody>
    <BTabs v-else content-class="mt-3" fill>
      <BTab title="Izmaksas aprēķins pēc apstrādes operācijām" active>
        <EquipmentExpensesByOperation />
      </BTab>
      <BTab title="Izmaksas aprēķins pēc apstrādes laukiem">
        <EquipmentExpensesByField />
      </BTab>
      <BTab title="Izmaksas aprēķins pēc tehnikas vienības">
        <TotalEquipmentExpenses />
      </BTab>
      <BTab title="Bruto seguma aprēķins">
        <GrossCoverage />
      </BTab>
    </BTabs>
  </CardContainer>
</template>

<style scoped>

</style>
