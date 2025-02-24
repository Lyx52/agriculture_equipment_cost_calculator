<script setup lang="ts">

import { BCard, BTabs, BTab, BCardBody, BSpinner } from 'bootstrap-vue-next'
import TotalEquipmentExpenses from '@/components/TotalEquipmentExpenses.vue'
import EquipmentExpensesByOperation from '@/components/EquipmentExpensesByOperation.vue'
import EquipmentExpensesByField from '@/components/EquipmentExpensesByField.vue'
import { onMounted, ref } from 'vue'
import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
import { useFarmlandStore } from '@/stores/farmland.ts'
import { useOperationStore } from '@/stores/operation.ts'
import { useIndicatorStore } from '@/stores/indicator.ts'
const equipmentCollection = useEquipmentCollectionStore();
const farmlandStore = useFarmlandStore();
const operationStore = useOperationStore();
const indicatorStore = useIndicatorStore();

const isLoading = ref<boolean>(true);

onMounted(async () => {
  await indicatorStore.getInflationRate();
  await indicatorStore.getInterestRate();
  await indicatorStore.getConsumerPriceIndices();
  await indicatorStore.getMotorHoursByYear();

  await equipmentCollection.fetchByFilters();
  await farmlandStore.fetchByFilters();
  await operationStore.fetchByFilters();
  isLoading.value = false;
});


</script>

<template>
  <BCard class="w-100 m-2">
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
        Nav izstrādāts
      </BTab>
    </BTabs>
  </BCard>
</template>

<style scoped>

</style>
