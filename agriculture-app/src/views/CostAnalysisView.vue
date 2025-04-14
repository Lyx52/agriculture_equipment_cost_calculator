<script setup lang="ts">

import { BTabs, BTab, BCardBody, BSpinner } from 'bootstrap-vue-next'
import TotalEquipmentExpenses from '@/components/TotalEquipmentExpenses.vue'
import EquipmentExpensesByOperation from '@/components/EquipmentExpensesByOperation.vue'
import EquipmentExpensesByField from '@/components/EquipmentExpensesByField.vue'
import { onMounted, ref } from 'vue'
import { useIndicatorStore } from '@/stores/indicator.ts'
import GrossCoverage from '@/components/GrossCoverage.vue'
import CardContainer from '@/components/elements/CardContainer.vue'
import { usePrefetchStore } from '@/stores/prefetch.ts'
const prefetchStore = usePrefetchStore();

</script>

<template>
  <CardContainer>
    <BCardBody v-if="prefetchStore.isLoading" class="text-center">
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
