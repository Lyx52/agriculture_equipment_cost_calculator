<script setup lang="ts">
import {BFormFloatingLabel, BFormInput} from 'bootstrap-vue-next'
import TechnicalEquipmentModal from "@/components/TechnicalEquipmentModal.vue";
import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
import EquipmentInformationTable from "@/components/EquipmentInformationTable.vue";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import PropertyInformation from "@/components/PropertyInformation.vue";
import TechnicalEquipmentInformation from "@/components/TechnicalEquipmentInformation.vue";
const equipmentCollectionStore = useEquipmentCollectionStore();
const onEquipmentAdded = (item: IEquipmentInformation) => {
    equipmentCollectionStore.pushItem(item);
}
</script>

<template>
  <div class="container-fluid my-3">
      <div class="d-flex flex-column flex-nowrap mb-3">
          <PropertyInformation />
      </div>
      <div class="d-flex flex-row flex-nowrap gap-3">
          <TechnicalEquipmentInformation
              title="Esošā tehnikas vienība"
          />
          <TechnicalEquipmentInformation
              title="Aizvietojamā tehnikas vienība"
          />
      </div>
      <div class="row">
          <div class="col">
            <EquipmentInformationTable />
          </div>
      </div>
  </div>
</template>

<style scoped>

</style>
