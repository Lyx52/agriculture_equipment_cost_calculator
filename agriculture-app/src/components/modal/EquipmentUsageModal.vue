<script setup lang="ts">
import { BButton, BFormGroup, BInputGroup, BModal, BToastOrchestrator, useToastController } from 'bootstrap-vue-next'
import { useEquipmentStore } from '@/stores/equipment.ts'
import BNumericFormInput from '@/components/elements/BNumericFormInput.vue'
import BDateFormInput from '@/components/elements/BDateFormInput.vue'
import { isValid } from 'date-fns'

const model = defineModel<boolean>();
const equipmentStore = useEquipmentStore();
const toastController = useToastController();

const onSaveEquipmentUsage = () => {
  if (!isValid(equipmentStore.item?.purchaseDate)) {
    toastController.show!({
      props: {
        variant: 'danger',
        pos: 'bottom-end',
        value: 1000,
        body: `Iegādes datums ir obligāts`,
      }
    });
    return;
  }

  const usageErrors = equipmentStore.validateUsage;
  if (usageErrors.length > 0) {
    toastController.show!({
      props: {
        variant: 'danger',
        pos: 'bottom-end',
        value: 1000,
        body: `${usageErrors.join(', ')} ir obligāti lauki`,
      }
    });
    return;
  }

  model.value = false;
}

</script>

<template>
  <BModal id="equipmentModal" v-model="model" size="lg" no-close-on-backdrop>
    <template #header>
      <h5>{{ equipmentStore.item.manufacturer }} {{ equipmentStore.item.model }} nolietojums</h5>
    </template>
    <div class="container-fluid">
      <div class="row row-cols-1 p-3">
        <div class="col">
          <BFormGroup label="Tehnikas iegādes datums">
            <BDateFormInput
              v-model="equipmentStore.item.purchaseDate as Date|undefined"
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
      <BToastOrchestrator/>
    </div>
    <template #footer >
      <BButton variant="success" @click="onSaveEquipmentUsage">Saglabāt nolietojumu</BButton>
    </template>
  </BModal>
</template>

<style scoped>

</style>
