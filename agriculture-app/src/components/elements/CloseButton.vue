<script setup lang="ts">
import { BButton } from 'bootstrap-vue-next'
</script>

<template>
  <BButton
    class="bg-transparent border-0 text-primary"
    @click="$emit('close')"
  >
    &#x2715;
  </BButton>
</template>

<style scoped>

</style>
