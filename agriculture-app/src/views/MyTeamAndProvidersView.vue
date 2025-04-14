<script setup lang="ts">
import MyTeamWorkbench from '@/components/MyTeamWorkbench.vue'
import CardContainer from '@/components/elements/CardContainer.vue'
import MyProvidersWorkbench from '@/components/MyProvidersWorkbench.vue'

</script>

<template>
  <CardContainer>
    <h4 class="card-title mb-3">Mani darbinieki un ārējie pakalpojumu sniedzēji</h4>
    <MyTeamWorkbench />
    <MyProvidersWorkbench />
  </CardContainer>
</template>
