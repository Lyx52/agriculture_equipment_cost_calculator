<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navigation from '@/components/NavigationHeader.vue'
</script>

<template>

  <main class="d-flex flex-row justify-content-start vh-100">
    <Navigation />
    <RouterView />
  </main>

</template>

<style scoped>

</style>
