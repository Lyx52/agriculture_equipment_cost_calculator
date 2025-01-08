<script setup lang="ts">
import { BButton, BFormGroup, BInputGroup, BModal } from 'bootstrap-vue-next'
import { useEquipmentStore } from '@/stores/equipment.ts'
import BNumericFormInput from '@/components/elements/BNumericFormInput.vue'
import BDateFormInput from '@/components/elements/BDateFormInput.vue'

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
          <BFormGroup label="Tehnikas iegādes datums">
            <BDateFormInput
              v-model="equipmentStore.item.purchaseDate"
            />
          </BFormGroup>
          <BFormGroup label="Ekonomiskais izmantošanas laiks">
            <BInputGroup append="gadi">
              <BNumericFormInput v-model="equipmentStore.item.usage!.expectedAge" />
            </BInputGroup>
          </BFormGroup>
          <BFormGroup label="Gada noslodze">
            <BInputGroup append="h">
              <BNumericFormInput v-model="equipmentStore.item.usage!.hoursPerYear" />
            </BInputGroup>
          </BFormGroup>
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
