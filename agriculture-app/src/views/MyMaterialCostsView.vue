<script setup lang="ts">
import { BCard } from 'bootstrap-vue-next'
import CropInventoryWorkbench from '@/components/CropInventoryWorkbench.vue'
import CustomMaterialAdjustmentWorkbench from '@/components/CustomMaterialAdjustmentWorkbench.vue'

</script>

<template>
  <BCard class="w-100 m-2 d-flex flex-column overflow-y-auto">
    <CustomMaterialAdjustmentWorkbench />
    <CropInventoryWorkbench />
  </BCard>
</template>
