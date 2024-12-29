
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
    BTfoot
  } from 'bootstrap-vue-next'
  import TrashIcon from '@/components/icons/TrashIcon.vue'
  import EquipmentModal from '@/components/modal/EquipmentModal.vue'
  import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
  import OperationsIcon from '@/components/icons/OperationsIcon.vue'
  import { useEquipmentStore } from '@/stores/equipment.ts'
  import type { IEquipment } from '@/stores/interface/IEquipment.ts'
  const equipmentCollectionStore = useEquipmentCollectionStore();
  const equipmentStore = useEquipmentStore();
  const onEditEquipment = (item: IEquipment) => {
    equipmentStore.fromEquipment(item);
    equipmentStore.showModal = true;
    equipmentStore.editMode = true;
  }
  const onAddEquipment = () => {
    equipmentStore.resetEquipment();
    equipmentStore.showModal = true;
    equipmentStore.editMode = false;
  }
</script>

<template>
  <div class="d-flex flex-column h-100">
    <div class="d-flex flex-row gap-3">
<!--      <BFormGroup label="Filtrēt pēc lauka">-->
<!--        <SimpleDropdown-->
<!--          :is-loading="false"-->
<!--          :get-filtered="farmlandStore.getFiltered"-->
<!--          :get-formatted-option="farmlandStore.getFormattedOption"-->
<!--          v-model="operationStore.filteredFarmland"-->
<!--        />-->
<!--      </BFormGroup>-->
<!--      <BFormGroup label="Filtrēt pēc apstrādes operācijas">-->
<!--        <CodifierDropdown-->
<!--          :is-valid="true"-->
<!--          :parent-codifier-code="Codifiers.OperationTypes"-->
<!--          @on-selected="onOperationFiltered"-->
<!--          :store-id="farmlandOperationStoreId"-->
<!--        />-->
<!--      </BFormGroup>-->
<!--      <BButton variant="danger" class="mt-auto ms-auto" v-if="hasFilters()" @click="resetFilters()">-->
<!--        Atiestatīt filtrus <IconX/>-->
<!--      </BButton>-->
    </div>
    <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
      <BThead class="position-sticky top-0 bg-primary in-front" >
        <BTr>
          <BTh>Tehnikas nosaukums</BTh>
          <BTh>Tehnikas tips</BTh>
          <BTh>Tehnikas vienība</BTh>
          <BTh>&nbsp;</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr v-for="row in equipmentCollectionStore.filteredItems" v-bind:key="row.id">
          <BTd>
            {{ row.manufacturer }} {{ row.model }}
          </BTd>
          <BTd>
            {{ row.equipment_type_code }}
          </BTd>
          <BTd>
            {{ row.specifications?.power_train_code }} {{ row.specifications?.power }}
          </BTd>
          <BTd>
            <BButtonGroup class="d-inline-flex flex-row btn-group">
              <BButton class="ms-auto flex-grow-0" variant="danger" size="sm" @click="equipmentCollectionStore.removeItem(row.id)">
                Dzēst <TrashIcon />
              </BButton>
              <BButton class="ms-auto flex-grow-0" variant="secondary" size="sm" @click="onEditEquipment(row)">
                Rediģēt <OperationsIcon />
              </BButton>
            </BButtonGroup>
          </BTd>
        </BTr>
      </BTbody>
      <BTfoot class="position-sticky bottom-0 in-front">
        <BTr>
          <BTd colspan="5">
            <BButton variant="success" size="sm" @click="onAddEquipment">Pievienot</BButton>
          </BTd>
        </BTr>
      </BTfoot>
    </BTableSimple>
    <EquipmentModal v-model="equipmentStore.showModal" />
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
</style>
