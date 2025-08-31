<script setup lang="ts">

import { BTabs, BTab, BSpinner } from 'bootstrap-vue-next'
import TotalEquipmentExpenses from '@/components/TotalEquipmentExpenses.vue'
import EquipmentExpensesByOperation from '@/components/EquipmentExpensesByOperation.vue'
import EquipmentExpensesByField from '@/components/EquipmentExpensesByField.vue'
import GrossCoverage from '@/components/GrossCoverage.vue'
import CardContainer from '@/components/elements/CardContainer.vue'
import { usePrefetchStore } from '@/stores/prefetch.ts'
import {useFarmlandStore} from "@/stores/farmland.ts";
const prefetchStore = usePrefetchStore();

const farmlandStore = useFarmlandStore();
const onTabChange = () => {
  farmlandStore.yearFilter = undefined;
}

</script>

<template>
  <CardContainer>
    <BSpinner v-if="prefetchStore.isLoading" class="m-auto" />
    <BTabs v-else content-class="mt-3" fill @activate-tab="onTabChange">
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
