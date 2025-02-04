<script setup lang="ts">

import { BCard, BTabs, BTab } from 'bootstrap-vue-next'
import TotalEquipmentExpenses from '@/components/TotalEquipmentExpenses.vue'
import EquipmentExpensesByOperation from '@/components/EquipmentExpensesByOperation.vue'
</script>

<template>
  <BCard class="w-100 m-2">
    <BTabs content-class="mt-3" fill>
      <BTab title="Izmaksas aprēķins pēc tehnikas vienības" active>
        <TotalEquipmentExpenses />
      </BTab>
      <BTab title="Izmaksas aprēķins pēc apstrādes operācijām" active>
        <EquipmentExpensesByOperation />
      </BTab>
      <BTab title="Izmaksas aprēķins pēc apstrādes laukiem" disabled>
        <p>I'm the tab with the very, very long title</p>
      </BTab>
    </BTabs>
  </BCard>
</template>

<style scoped>

</style>
