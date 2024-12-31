<script setup lang="ts">

import { BCard, BTabs, BTab } from 'bootstrap-vue-next'
import EquipmentExpenses from '@/components/EquipmentExpenses.vue'
</script>

<template>
  <BCard class="w-100 m-2">
    <BTabs content-class="mt-3" fill>
      <BTab title="Izmaksas visā lietošanas laikā" active>
        <EquipmentExpenses />
      </BTab>
      <BTab title="Izmaksas aprēķins pēc apstrādes operācijām" disabled>
        <p>I'm the second tab</p>
      </BTab>
      <BTab title="Izmaksas aprēķins pēc apstrādes laukiem" disabled>
        <p>I'm the tab with the very, very long title</p>
      </BTab>
    </BTabs>
  </BCard>
</template>

<style scoped>

</style>
