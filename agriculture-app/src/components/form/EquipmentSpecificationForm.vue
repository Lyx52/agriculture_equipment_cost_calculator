<script setup lang="ts">
  import { BFormGroup } from 'bootstrap-vue-next'
  import CodifierDropdown from '@/components/elements/CodifierDropdown.vue'
  import { Codifiers } from '@/stores/enums/Codifiers.ts'
  import { computed, onMounted, watch } from 'vue'
  import { v4 as uuid } from 'uuid';
  import { useCodifierStore } from '@/stores/codifier.ts'
  import BNumericFormInput from '@/components/elements/BNumericFormInput.vue'
  import type { ICodifier } from '@/stores/interface/ICodifier.ts'
  import { useEquipmentStore } from '@/stores/equipment.ts'
  const powerTrainCodifierStore = useCodifierStore(uuid());
  const equipmentStore = useEquipmentStore();

  const isTractorOrCombine = computed(() => {
    return [
      'lauksaimniecibas_traktors',
      'kartupelu_novaksanas_kombains',
      'darzenu_novaksanas_kombains',
      'graudaugu_kombains',
      'ogu_novaksans_kombains'
    ].includes(equipmentStore.item.equipment_type_code)
  });
  onMounted(async () => {
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
    <BFormGroup label="Jauda, kw" v-if="isTractorOrCombine">
      <BNumericFormInput
        v-model="equipmentStore.item.specifications.power"
      />
    </BFormGroup>
    <BFormGroup label="Piedziņas tips" v-if="isTractorOrCombine">
      <CodifierDropdown
        :is-valid="true"
        :parent-codifier-codes="[Codifiers.PowerTrainTypes]"
        :store-id="powerTrainCodifierStore.storeId"
        @on-selected="onPowerTrainSelected"
      />
    </BFormGroup>
    <BFormGroup label="Nepieciešamā jauda, kw" v-if="!isTractorOrCombine">
      <BNumericFormInput
        v-model="equipmentStore.item.specifications.required_power"
      />
    </BFormGroup>
  </div>
</template>

<style scoped>

</style>
