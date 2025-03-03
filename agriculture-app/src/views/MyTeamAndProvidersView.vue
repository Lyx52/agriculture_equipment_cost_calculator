<script setup lang="ts">
import { BCard } from 'bootstrap-vue-next'
import MyTeamWorkbench from '@/components/MyTeamWorkbench.vue'
import { useAdjustmentsStore } from '@/stores/adjustments.ts'
import { onBeforeMount } from 'vue'

const adjustmentStore = useAdjustmentsStore();
onBeforeMount(async () => {
  await adjustmentStore.fetchByFilters();
});
</script>

<template>
  <BCard class="w-100 m-2 d-flex flex-column overflow-y-auto">
    <h4 class="card-title mb-3">Mani darbinieki un ārējie pakalpojumu sniedzēji</h4>
    <MyTeamWorkbench />
  </BCard>
</template>
