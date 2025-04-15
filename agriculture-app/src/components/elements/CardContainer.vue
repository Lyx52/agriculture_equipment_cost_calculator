<template>
  <BCard class="content-card w-100 h-100 shadow">
    <slot></slot>
  </BCard>
</template>
<script setup lang="ts">
import { BCard } from 'bootstrap-vue-next'
</script>
<style lang="scss">
  .content-card .card-body {
    display: flex;
    flex-flow: column;
  }
</style>
