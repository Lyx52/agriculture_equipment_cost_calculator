<script setup lang="ts">

import TechnicalEquipmentModal from "@/components/TechnicalEquipmentModal.vue";
import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
import EquipmentInformationTable from "@/components/EquipmentInformationTable.vue";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
const equipmentCollectionStore = useEquipmentCollectionStore();
const onEquipmentAdded = (item: IEquipmentInformation) => {
    equipmentCollectionStore.pushItem(item);
}
</script>

<template>
  <div>
      <TechnicalEquipmentModal @onEquipmentAdded="onEquipmentAdded" />
      <EquipmentInformationTable />
  </div>
</template>

<style scoped>

</style>
