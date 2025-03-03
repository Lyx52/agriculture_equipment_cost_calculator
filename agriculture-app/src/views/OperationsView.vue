<script setup lang="ts">
import OperationWorkbench from '@/components/OperationWorkbench.vue'
import CardContainer from '@/components/elements/CardContainer.vue'
</script>

<template>
  <CardContainer>
    <OperationWorkbench :is-modal="false" />
  </CardContainer>
</template>
