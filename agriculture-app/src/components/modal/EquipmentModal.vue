<script setup lang="ts">
import { BButton, BFormGroup, BModal, BFormInput } from 'bootstrap-vue-next'
import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
import type { ICodifier } from '@/stores/interface/ICodifier.ts'
import { ref } from 'vue'
import { Codifiers } from '@/stores/enums/Codifiers.ts'
import CodifierDropdown from '@/components/elements/CodifierDropdown.vue'
import { useCodifierStore } from '@/stores/codifier.ts'
import { v4 as uuid } from 'uuid';
import type { IEquipment } from '@/stores/interface/IEquipment.ts'
import BNumericFormInput from '@/components/elements/BNumericFormInput.vue'
import EquipmentDropdown from '@/components/elements/EquipmentDropdown.vue'
import { useEquipmentFilterStore } from '@/stores/equipmentFilter.ts'
import EquipmentSpecificationForm from '@/components/form/EquipmentSpecificationForm.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import { useEquipmentStore } from '@/stores/equipment.ts'

const model = defineModel<boolean>();
const equipmentCollectionStore = useEquipmentCollectionStore();
const equipmentStore = useEquipmentStore();

const showSearch = ref<boolean>(false);
const showEquipmentForm = ref<boolean>(true);
const categoryTypeParentCodes = ref<string[]>([]);

const categoryFilterStore = useCodifierStore(uuid());
const categoryTypeFilterStore = useCodifierStore(uuid());
const equipmentTypeStore = useCodifierStore(uuid());
const equipmentFilterStore = useEquipmentFilterStore();
const clearFilters = async () => {
  categoryTypeFilterStore.$reset();
  equipmentFilterStore.$reset();
  categoryFilterStore.$patch({
    codifierTypeCodes: [Codifiers.EquipmentTypes],
    filterTo: 25,
    searchText: ''
  });
  await categoryFilterStore.fetchByFilters();
  categoryTypeParentCodes.value = categoryFilterStore.items.map(c => c.code);
}
const onShowEquipmentForm = async () => {
  showEquipmentForm.value = true;
  showSearch.value = false;
  await clearFilters();
}

const onShowSearchForm = () => {
  showEquipmentForm.value = false;
  showSearch.value = true
}

const onCategoryTypeFilterSelected = (item: ICodifier) => {
  equipmentFilterStore.setCategoryTypeCodes([item.code]);
  categoryTypeParentCodes.value = categoryFilterStore.items.map(c => c.code);
}

const onCategoryFilterSelected = (item: ICodifier) => {
  categoryTypeParentCodes.value = [item.code];
}

const onAddEquipment = () => {
  equipmentCollectionStore.pushItem(equipmentStore.item);
  model.value = false;
}

const onEquipmentSelected = async (item: IEquipment) => {
  equipmentStore.fromEquipment(item);
  await equipmentTypeStore.setSelectedByCode(item.equipment_type_code);
  await onShowEquipmentForm();
}

const onModalShow = async () => {
  await clearFilters();
}

</script>

<template>
  <BModal id="equipmentModal" v-model="model" size="lg" @shown="onModalShow" >
    <template #header>
      <div class="d-flex w-100 flex-row justify-content-between">
        <h5 class="my-auto">Pievienot tehnikas vienību</h5>
        <BButton class="my-auto" size="sm" @click="onShowSearchForm" v-if="showEquipmentForm">Meklēt datubāzē <IconSearch /></BButton>
        <BButton class="my-auto" size="sm" variant="success" @click="onShowEquipmentForm" v-if="showSearch">Pievienot manuāli <IconPlus /></BButton>
      </div>
    </template>
    <div class="container-fluid">
      <div class="row row-cols-1 p-3">
        <div class="col" v-if="showSearch">
          <h5>Meklēt tehnikas vienību</h5>
          <BFormGroup label="Tehnikas kategorija">
            <CodifierDropdown
              :is-valid="true"
              :parent-codifier-codes="[Codifiers.EquipmentTypes]"
              @on-selected="onCategoryFilterSelected"
              :store-id="categoryFilterStore.storeId"
            />
          </BFormGroup>
          <BFormGroup label="Tehnikas tips" class="mt-3">
            <CodifierDropdown
              :is-valid="true"
              :parent-codifier-codes="categoryTypeParentCodes"
              @on-selected="onCategoryTypeFilterSelected"
              :store-id="categoryTypeFilterStore.storeId"
            />
          </BFormGroup>
          <BFormGroup label="Meklēt tehnikas vienību:" class="mt-3">
            <EquipmentDropdown
              @on-selected="onEquipmentSelected"
            />
          </BFormGroup>
        </div>
        <div class="col" v-if="showEquipmentForm">
          <h5>Tehnikas informācija</h5>
          <BFormGroup label="Marka">
            <BFormInput
              v-model="equipmentStore.item.manufacturer"
            />
          </BFormGroup>
          <BFormGroup label="Modelis" class="mt-3">
            <BFormInput
              v-model="equipmentStore.item.model"
            />
          </BFormGroup>
          <BFormGroup label="Iegādes cena">
            <BNumericFormInput v-model="equipmentStore.item.price" />
          </BFormGroup>
          <BFormGroup label="Tehnikas tips">
            <CodifierDropdown
              :is-valid="true"
              :parent-codifier-codes="categoryFilterStore.items.map(c => c.code)"
              :store-id="equipmentTypeStore.storeId"
            />
          </BFormGroup>
          <BFormGroup label="Tehnikas specifikācija">
            <EquipmentSpecificationForm />
          </BFormGroup>
        </div>
      </div>
    </div>
    <template #footer >
      <BButton variant="success" @click="onAddEquipment" v-if="showEquipmentForm">{{ equipmentStore.editMode ? 'Saglabāt' : 'Pievienot' }}</BButton>
      <span v-else>&nbsp;</span>
    </template>
  </BModal>
</template>

<style scoped>

</style>
