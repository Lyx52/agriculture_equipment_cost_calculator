<script setup lang="ts">
  import type { ISumTdProps } from '@/components/table/ISumTdProps.ts'
  import { DisplayNumber, sumBy } from '@/utils.ts'
  import { BTd } from 'bootstrap-vue-next'
  const props = defineProps<ISumTdProps>();
</script>

<template>
  <BTd class="text-start align-middle">
    {{ DisplayNumber(sumBy(props.items, item => props.getProp(item))) }}
  </BTd>
</template>
