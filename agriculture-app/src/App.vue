<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navigation from '@/components/NavigationHeader.vue'
import { BModalOrchestrator } from 'bootstrap-vue-next';
</script>

<template>

  <main class="d-flex flex-row justify-content-start vh-100">
    <Navigation />
    <RouterView />
    <BModalOrchestrator />
  </main>

</template>

<style scoped>

</style>
