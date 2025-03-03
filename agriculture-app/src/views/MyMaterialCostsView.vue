<script setup lang="ts">
import CropInventoryWorkbench from '@/components/CropInventoryWorkbench.vue'
import CustomMaterialAdjustmentWorkbench from '@/components/CustomMaterialAdjustmentWorkbench.vue'
import CardContainer from '@/components/elements/CardContainer.vue'

</script>

<template>
  <CardContainer>
    <h4 class="card-title mb-3">Saimniecības izejvielas</h4>
    <CustomMaterialAdjustmentWorkbench />
    <CropInventoryWorkbench />
  </CardContainer>
</template>
