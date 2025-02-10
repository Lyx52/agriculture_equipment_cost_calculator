<script setup lang="ts">

import { BCard, BTabs, BTab } from 'bootstrap-vue-next'
import TotalEquipmentExpenses from '@/components/TotalEquipmentExpenses.vue'
import EquipmentExpensesByOperation from '@/components/EquipmentExpensesByOperation.vue'
import EquipmentExpensesByField from '@/components/EquipmentExpensesByField.vue'
</script>

<template>
  <BCard class="w-100 m-2">
    <BTabs content-class="mt-3" fill>
      <BTab title="Izmaksas aprēķins pēc apstrādes operācijām" active>
        <EquipmentExpensesByOperation />
      </BTab>
      <BTab title="Izmaksas aprēķins pēc apstrādes laukiem">
        <EquipmentExpensesByField />
      </BTab>
      <BTab title="Izmaksas aprēķins pēc tehnikas vienības">
        <TotalEquipmentExpenses />
      </BTab>
    </BTabs>
  </BCard>
</template>

<style scoped>

</style>
