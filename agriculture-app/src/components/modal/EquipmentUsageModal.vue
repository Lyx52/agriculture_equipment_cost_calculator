<script setup lang="ts">
import { BButton, BFormGroup, BInputGroup, BModal, BToastOrchestrator, useToastController, BFormCheckbox } from 'bootstrap-vue-next'
import { useEquipmentStore } from '@/stores/equipment.ts'
import BNumericFormInput from '@/components/elements/BNumericFormInput.vue'
import BDateFormInput from '@/components/elements/BDateFormInput.vue'
import { isValid } from 'date-fns'
import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
import { yearsBetweenDates } from '@/utils.ts'
import type { IEquipmentUsageModalProps } from '@/props/IEquipmentUsageModalProps.ts'
import { ref, watch } from 'vue'
import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'
const props = defineProps<IEquipmentUsageModalProps>();
const model = defineModel<boolean>();
const equipmentStore = useEquipmentStore();
const toastController = useToastController();
const equipmentCollectionStore = useEquipmentCollectionStore();
const usage = ref<IEquipmentUsage>(props.usage);
watch(props, (newUsage) => {
  usage.value = newUsage.usage;
});

const validateUsage = (): string[] => {
  const errors = [] as string[];
  const isUsagePerIndividualYear = usage?.value?.use_hours_per_individual_years ?? false;
  for (const [property, value] of Object.entries(usage?.value ?? {})) {
    switch (property) {
      case 'expected_age':
      {
        if (isNaN(value) || Number(value) <= 0) {
          errors.push("Ekonomiskais izmantošanas laiks");
        }
      } break;
      case 'hours_per_year':
      {
        if (isNaN(value) || Number(value) <= 0 && !isUsagePerIndividualYear) {
          errors.push("Vidējā gada noslodze");
        }
      } break;
      case 'use_hours_per_individual_years':
      {
        if (!isUsagePerIndividualYear) break;
        for (const hoursPerYear of Object.keys(value)) {
          if (isNaN(hoursPerYear) || Number(hoursPerYear) <= 0) {
            errors.push("Noslodze pa gadiem");
            break;
          }
        }
      } break;
    }
  }

  return errors;
};

const onChangeToIndividualYears = (e) => {
  usage.value = {
    ...usage.value,
    use_hours_per_individual_years: e.target.checked,
    hours_per_individual_years: Object.fromEntries(yearsBetweenDates(equipmentStore.item?.purchase_date).map(year => [year.toString(), 300]))
  }
}

const onSaveEquipmentUsage = () => {
  if (!isValid(equipmentStore.item?.purchase_date)) {
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

  const usageErrors = validateUsage();
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
  equipmentStore.$patch({
    item: {
      usage: usage.value
    }
  });
  equipmentCollectionStore.updateEquipmentAsync(equipmentStore.item);
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
              v-model="equipmentStore.item.purchase_date as Date|undefined"
            />
          </BFormGroup>
          <BFormGroup label="Ekonomiskais izmantošanas laiks">
            <BInputGroup append="gadi">
              <BNumericFormInput v-model="usage.expected_age" />
            </BInputGroup>
          </BFormGroup>
          <BFormGroup label="Ievadīt pa gadiem">
            <BFormCheckbox
              switch
              v-model="usage.use_hours_per_individual_years"
              @change="onChangeToIndividualYears"
            />
          </BFormGroup>
          <BFormGroup v-if="usage.use_hours_per_individual_years" label="Noslodze pa gadiem" class="individual-hours-container">
            <BInputGroup class="mt-2" :prepend="year" append="h" v-for="(hours, year) in usage.hours_per_individual_years" :key="year">
              <BNumericFormInput v-model="usage.hours_per_individual_years[year]" />
            </BInputGroup>
          </BFormGroup>
          <BFormGroup v-else label="Vidējā gada noslodze">
            <BInputGroup append="h">
              <BNumericFormInput v-model="usage.hours_per_year" />
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
  .individual-hours-container {
    max-height: 40vh;
    overflow-y: auto;
  }
</style>
