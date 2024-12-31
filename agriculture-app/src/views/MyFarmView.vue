<script setup lang="ts">
import { BCard, BCardBody } from 'bootstrap-vue-next'
import MyFarmWorkbench from '@/components/MyFarmWorkbench.vue'
</script>

<template>
  <BCard class="w-100 m-2 shadow">
    <BCardBody class="d-flex flex-column h-100">
      <MyFarmWorkbench />
    </BCardBody>
  </BCard>
</template>

<style scoped>

</style>
