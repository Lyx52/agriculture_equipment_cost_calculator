
<script setup lang="ts">
  import {
    BTableSimple,
    BThead,
    BTr,
    BTh,
    BTbody,
    BTd,
    BButton,
    BButtonGroup,
    BTfoot,
    BFormGroup
  } from 'bootstrap-vue-next'
  import TrashIcon from '@/components/icons/TrashIcon.vue'
  import EquipmentModal from '@/components/modal/EquipmentModal.vue'
  import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
  import OperationsIcon from '@/components/icons/OperationsIcon.vue'
  import { useEquipmentStore } from '@/stores/equipment.ts'
  import type { IEquipment } from '@/stores/interface/IEquipment.ts'
  import CodifierDropdown from '@/components/elements/CodifierDropdown.vue'
  import { Codifiers } from '@/stores/enums/Codifiers.ts'
  import type { ICodifier } from '@/stores/interface/ICodifier.ts'
  import IconX from '@/components/icons/IconX.vue'
  import { v4 as uuid } from 'uuid';
  import { useCodifierStore } from '@/stores/codifier.ts'
  import { onBeforeMount } from 'vue'
  import IconClockHistory from '@/components/icons/IconClockHistory.vue'
  import EquipmentUsageModal from '@/components/modal/EquipmentUsageModal.vue'
  const equipmentCollectionStore = useEquipmentCollectionStore();
  const equipmentStore = useEquipmentStore();
  const equipmentCodifierStore = useCodifierStore(uuid());
  const equipmentCategoryTypeStore = useCodifierStore(uuid());
  onBeforeMount(async() => {
    equipmentCodifierStore.$reset();
    equipmentCodifierStore.$patch({
      addChildren: true,
      codifierTypeCodes: [Codifiers.EquipmentTypes]
    });
    await equipmentCodifierStore.fetchByFilters();
  })
  const onEditEquipment = (item: IEquipment) => {
    equipmentStore.fromEquipment(item);
    equipmentStore.$patch({
      showModal: true,
      editMode: true
    })
  }
  const onAddUsage = (item: IEquipment) => {
    equipmentStore.fromEquipment(item);
    equipmentStore.$patch({
      showUsageModal: true
    });
  }
  const onAddEquipment = () => {
    equipmentStore.resetEquipment();
    equipmentStore.$patch({
      showModal: true,
      editMode: false
    })
  }
  const onEquipmentTypeSelected = (item: ICodifier) => {
    equipmentCollectionStore.$patch({
      equipmentCategoryTypeCode: item.code
    })
  }
  const hasFilters = (): boolean => {
    return !!equipmentCollectionStore.equipmentCategoryTypeCode;
  }
  const resetFilters = () => {
    equipmentCollectionStore.$patch({
      equipmentCategoryTypeCode: undefined
    });
    equipmentCategoryTypeStore.$reset();
  }
</script>

<template>
  <div class="d-flex flex-column h-100">
    <div class="d-flex flex-row gap-3">
      <BFormGroup label="Filtrēt pēc tehnikas tipa">
        <CodifierDropdown
          :is-valid="true"
          :parent-codifier-codes="equipmentCodifierStore.items.map(c => c.code)"
          @on-selected="onEquipmentTypeSelected"
          :store-id="equipmentCategoryTypeStore.storeId"
        />
      </BFormGroup>
      <BButton variant="danger" class="mt-auto ms-auto" v-if="hasFilters()" @click="resetFilters()">
        Atiestatīt filtrus <IconX />
      </BButton>
    </div>
    <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
      <BThead class="position-sticky top-0 bg-primary in-front" >
        <BTr>
          <BTh>Tehnikas nosaukums</BTh>
          <BTh>Tehnikas tips</BTh>
          <BTh>Jauda</BTh>
          <BTh>Nepieciešamā jauda</BTh>
          <BTh>Darba platums</BTh>
          <BTh>&nbsp;</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr v-for="row in equipmentCollectionStore.filteredItems" v-bind:key="row.id">
          <BTd>
            {{ row.manufacturer }} {{ row.model }} {{ equipmentCollectionStore.getPowerOrRequiredPower(row) }}
          </BTd>
          <BTd>
            {{ row.equipment_type?.name }}
          </BTd>
          <BTd class="text-center">
            {{ row.specifications.power ? `${row.specifications.power?.toFixed(2)} kw` : '' }}
          </BTd>
          <BTd class="text-center">
            {{ row.specifications.required_power ? `${row.specifications.required_power?.toFixed(2)} kw` : '' }}
          </BTd>
          <BTd>
            {{ row.specifications.required_power ? `${row.specifications.work_width?.toFixed(2)} m` : '' }}
          </BTd>
          <BTd>
            <BButtonGroup class="d-inline-flex flex-row btn-group">
              <BButton class="ms-auto flex-grow-0" variant="danger" size="sm" @click="equipmentCollectionStore.removeItem(row.id)">
                Dzēst <TrashIcon />
              </BButton>
              <BButton class="ms-auto flex-grow-0" variant="secondary" size="sm" @click="onEditEquipment(row)">
                Rediģēt <OperationsIcon />
              </BButton>
              <BButton class="ms-auto flex-grow-0" variant="info" size="sm" @click="onAddUsage(row)">
                Pievienot nolietojumu <IconClockHistory />
              </BButton>
            </BButtonGroup>
          </BTd>
        </BTr>
      </BTbody>
      <BTfoot class="position-sticky bottom-0 in-front">
        <BTr>
          <BTd colspan="6">
            <BButton variant="success" size="sm" @click="onAddEquipment">Pievienot</BButton>
          </BTd>
        </BTr>
      </BTfoot>
    </BTableSimple>
    <EquipmentModal v-model="equipmentStore.showModal" />
    <EquipmentUsageModal v-model="equipmentStore.showUsageModal" />
  </div>
</template>

<style scoped>
  .table-height {
    max-height: 85vh;
    min-height: 50vh;
  }
  .in-front {
    z-index: 999;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
