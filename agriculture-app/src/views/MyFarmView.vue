<script setup lang="ts">
import { BCardBody } from 'bootstrap-vue-next'
import MyFarmWorkbench from '@/components/MyFarmWorkbench.vue'
import CardContainer from '@/components/elements/CardContainer.vue'
</script>

<template>
  <CardContainer>
    <BCardBody class="d-flex flex-column h-100">
      <MyFarmWorkbench />
    </BCardBody>
  </CardContainer>
</template>

<style scoped>

</style>
