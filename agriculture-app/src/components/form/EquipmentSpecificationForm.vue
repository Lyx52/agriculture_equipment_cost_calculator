<script setup lang="ts">
  import { BFormGroup, BFormCheckbox } from 'bootstrap-vue-next'
  import CodifierDropdown from '@/components/elements/CodifierDropdown.vue'
  import { Codifiers } from '@/stores/enums/Codifiers.ts'
  import { onMounted, watch } from 'vue'
  import { v4 as uuid } from 'uuid';
  import { useCodifierStore } from '@/stores/codifier.ts'
  import BNumericFormInput from '@/components/elements/BNumericFormInput.vue'
  import type { ICodifier } from '@/stores/interface/ICodifier.ts'
  import { useEquipmentStore } from '@/stores/equipment.ts'
  const powerTrainCodifierStore = useCodifierStore(uuid());
  const equipmentStore = useEquipmentStore();

  onMounted(async () => {
    await powerTrainCodifierStore.setSelectedByCode(equipmentStore.item.specifications.power_train_code)
  })
  watch(() => equipmentStore.item.specifications.power_train_code, async () => {
    await powerTrainCodifierStore.setSelectedByCode(equipmentStore.item.specifications.power_train_code)
  })
  const onPowerTrainSelected = (item: ICodifier) => {
    equipmentStore.$patch({
      item: {
        specifications: {
          power_train_code: item.code
        }
      }
    })
  }
</script>

<template>
  <div class="d-flex flex-column" v-bind:key="equipmentStore.item.id">
    <BFormGroup label="Jauda, kw" v-if="equipmentStore.isTractorOrCombine || equipmentStore.isSelfPropelled">
      <BNumericFormInput
        v-model="equipmentStore.item.specifications.power"
      />
    </BFormGroup>
    <BFormGroup label="Īpatnējais degvielas patēriņš, kg/kWh" v-if="equipmentStore.isTractorOrCombine || equipmentStore.isSelfPropelled">
      <BNumericFormInput
        v-model="equipmentStore.item.specifications.fuel_consumption_coefficient"
      />
    </BFormGroup>
    <BFormGroup label="Piedziņas tips" v-if="equipmentStore.isTractorOrCombine">
      <CodifierDropdown
        :is-valid="true"
        :parent-codifier-codes="[Codifiers.PowerTrainTypes]"
        :store-id="powerTrainCodifierStore.storeId"
        @on-selected="onPowerTrainSelected"
      />
    </BFormGroup>
    <BFormGroup label="Nepieciešamā jauda, kw" v-if="!(equipmentStore.isTractorOrCombine || equipmentStore.isSelfPropelled)">
      <BNumericFormInput
        v-model="equipmentStore.item.specifications.required_power"
      />
    </BFormGroup>
    <BFormGroup label="Darba platums, m" v-if="!equipmentStore.isTractor">
      <BNumericFormInput
        v-model="equipmentStore.item.specifications.work_width"
      />
    </BFormGroup>
    <BFormGroup label="Ir pašgājējs" v-if="!equipmentStore.isTractor">
      <BFormCheckbox
        switch
        v-model="equipmentStore.item.specifications.self_propelled"
      />
    </BFormGroup>
  </div>
</template>

<style scoped>

</style>
