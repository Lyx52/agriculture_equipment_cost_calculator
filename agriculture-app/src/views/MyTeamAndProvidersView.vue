<script setup lang="ts">
import MyTeamWorkbench from '@/components/MyTeamWorkbench.vue'
import { useAdjustmentsStore } from '@/stores/adjustments.ts'
import { onBeforeMount } from 'vue'
import CardContainer from '@/components/elements/CardContainer.vue'
import MyProvidersWorkbench from '@/components/MyProvidersWorkbench.vue'

const adjustmentStore = useAdjustmentsStore();
onBeforeMount(async () => {
  await adjustmentStore.fetchByFilters();
});
</script>

<template>
  <CardContainer>
    <h4 class="card-title mb-3">Mani darbinieki un ārējie pakalpojumu sniedzēji</h4>
    <MyTeamWorkbench />
    <MyProvidersWorkbench />
  </CardContainer>
</template>
