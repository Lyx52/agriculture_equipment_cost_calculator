<script setup lang="ts">
import { BButton, BModal } from 'bootstrap-vue-next'
import { useEquipmentStore } from '@/stores/equipment.ts'

const model = defineModel<boolean>();
const equipmentStore = useEquipmentStore();
const onModalShow = async () => {

}

const onSaveEquipmentUsage = () => {
  model.value = false;
}

</script>

<template>
  <BModal id="equipmentModal" v-model="model" size="lg" @shown="onModalShow" >
    <template #header>
      <h5>{{ equipmentStore.item.manufacturer }} {{ equipmentStore.item.model }} nolietojums</h5>
    </template>
    <div class="container-fluid">
      <div class="row row-cols-1 p-3">
        <div class="col">

        </div>
      </div>
    </div>
    <template #footer >
      <BButton variant="success" @click="onSaveEquipmentUsage">Saglabāt nolietojumu</BButton>
    </template>
  </BModal>
</template>

<style scoped>

</style>
