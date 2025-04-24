<script setup lang="ts">
import { BButton, BModal } from 'bootstrap-vue-next'
import OperationWorkbench from '@/components/OperationWorkbench.vue'
import { useOperationStore } from '@/stores/operation.ts'

const model = defineModel<boolean>();
const operationStore = useOperationStore();
const onSaveEquipmentUsage = () => {
  model.value = false;
}
const onHideOperations = () => {
  operationStore.resetFilters();
}
</script>

<template>
  <BModal @hide="onHideOperations" id="farmlandOperationsModal" v-model="model" fullscreen no-close-on-backdrop title="Apstrādes operācijas">
    <div class="container-fluid p-0 h-100">
      <div class="row row-cols-1 h-100">
        <div class="col operations-modal">
          <OperationWorkbench :is-modal="true"/>
        </div>
      </div>
    </div>
    <template #footer>
      <BButton variant="success" @click="onSaveEquipmentUsage">Saglabāt apstrādes operācijas</BButton>
    </template>
  </BModal>
</template>

<style lang="scss">
.operations-modal {
  max-height: 100%;
}
</style>
