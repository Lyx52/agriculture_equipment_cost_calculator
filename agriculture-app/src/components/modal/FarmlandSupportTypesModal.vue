
<script setup lang="ts">
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { BButton, BFormGroup, BModal, BFormCheckbox, BSpinner, BFormInput } from 'bootstrap-vue-next'
import { onMounted, ref, watch } from 'vue'
import type { IFarmlandSupportTypesModalProps } from '@/props/IFarmlandSupportTypesModalProps.ts'
import { useAgriculturalSupportCodifierStore } from '@/stores/codifier.ts'
import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'
import { useAdjustmentsStore } from '@/stores/adjustments.ts'
import CloseButton from '@/components/elements/CloseButton.vue'
const props = defineProps<IFarmlandSupportTypesModalProps>();
const model = defineModel<boolean>();
const codifierStore = useAgriculturalSupportCodifierStore();
const supportTypes = ref<Record<string, boolean>>({});

const adjustmentStore = useAdjustmentsStore();
const farmland = ref<FarmlandModel|undefined>(undefined);
watch(props, (newProps) => {
  farmland.value = newProps.farmland;
  updateFarmlandSupportTypes();
});
const updateFarmlandSupportTypes = () => {
  if (!farmland.value) return;

  const farmlandSupportTypes = farmland.value.agriculturalSupportAdjustments.map(v => v.adjustment_type_code);
  supportTypes.value = {};
  for (const supportTypeCodifier of codifierStore.items) {
    supportTypes.value[supportTypeCodifier.code] = farmlandSupportTypes.includes(supportTypeCodifier.code);
  }
}

const onSaveSupportTypes = async () => {
  if (!farmland.value) return;
  const farmlandSupportTypes = farmland.value.agriculturalSupportAdjustments;
  const allTasks = [];
  for (const supportTypeCodifier of codifierStore.items) {
    const existingSupportType = farmlandSupportTypes.find(v => v.adjustment_type_code === supportTypeCodifier.code);

    if (supportTypes.value[supportTypeCodifier.code] && !existingSupportType?.id) {
      // Must be added
      allTasks.push(adjustmentStore.addAdjustmentAsync({
        adjustment_type_code: supportTypeCodifier.code,
        user_farmland_id: farmland.value.id,
        value: Number(supportTypeCodifier.value),
        name: supportTypeCodifier.name,
        id: undefined
      }));
    } else if (!supportTypes.value[supportTypeCodifier.code] && existingSupportType?.id) {
      // Must be removed
      allTasks.push(adjustmentStore.removeAdjustmentAsync(existingSupportType.id));
    }
  }
  await Promise.all(allTasks);
  model.value = false;
}
onMounted(async () => {
  await codifierStore.fetchByFilters();
  updateFarmlandSupportTypes();
})

</script>

<template>
  <BModal id="equipmentModal" v-model="model" size="lg" no-close-on-backdrop>
    <template #header>
      <div class="d-flex w-100 flex-row justify-content-between">
        <h5 class="my-auto"><span class="text-decoration-underline">{{ props.farmland?.displayName ?? 'Lauka' }}</span> atbalsta veidi</h5>
        <CloseButton @close="() => model = false" />
      </div>
    </template>
    <div class="container-fluid">
      <div class="row row-cols-1 p-3">
        <div v-if="adjustmentStore.isLoading" class="col d-flex justify-content-center">
          <BSpinner v-if="true"/>
        </div>
        <div v-else class="col">
          <BFormGroup label="Atbalsta veidi" class="individual-hours-container">
            <div class="d-flex flex-row" v-for="codifier in codifierStore.items" :key="codifier.code">
              <BFormCheckbox
                switch
                v-model="supportTypes[codifier.code]"
              />
              <span>{{ codifier.name }} - <b>{{ codifier.value }}</b> EUR/ha</span>
            </div>
            <div class="d-flex flex-row gap-2" v-for="codifier in codifierStore.items" :key="codifier.code">
              <BFormInput
                id="inputSearchBlockNr"
                placeholder="00000-00000"
                trim
              />
              <BFormInput
                id="inputSearchBlockNr"
                placeholder="00000-00000"
                trim
                class="w-25"
              />
            </div>
          </BFormGroup>
        </div>
      </div>
    </div>
    <template #footer >
      <BButton variant="success" @click="onSaveSupportTypes">Saglabāt atbalsta veidus</BButton>
    </template>
  </BModal>
</template>

<style scoped>
  .individual-hours-container {
    max-height: 40vh;
    overflow-y: auto;
  }
</style>
