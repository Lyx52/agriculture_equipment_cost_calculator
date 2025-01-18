<script setup lang="ts">
import { BButton, BModal } from 'bootstrap-vue-next'
import OperationWorkbench from '@/components/OperationWorkbench.vue'

const model = defineModel<boolean>();

const onSaveEquipmentUsage = () => {
  model.value = false;
}

</script>

<template>
  <BModal id="farmlandOperationsModal" v-model="model" fullscreen no-close-on-backdrop title="Apstrādes operācijas">
    <div class="container-fluid p-0">
      <div class="row row-cols-1">
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
    .table-height {
      max-height: 80vh !important;
    }
  }
</style>
