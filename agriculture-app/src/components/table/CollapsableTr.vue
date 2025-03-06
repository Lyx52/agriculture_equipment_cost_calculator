<script setup lang="ts">
import { BTh, BTr } from 'bootstrap-vue-next'
import OpenButton from '@/components/elements/OpenButton.vue'
import { ref } from 'vue'
const openState = ref<boolean>(false);
</script>

<template>
  <BTr>
    <BTh><OpenButton v-model="openState" /></BTh>
    <slot></slot>
  </BTr>
  <slot v-if="openState" name="collapsed"></slot>
</template>
