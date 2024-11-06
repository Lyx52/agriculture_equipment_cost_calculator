<template>
  <div class="container-fluid my-3">
      <div class="d-flex flex-column flex-nowrap mb-3">
          <PropertyInformation />
      </div>
      <div class="row">
          <div class="col">
            <EquipmentInformationTable
                :equipment-types="['tractors', 'agricultural_harvesters']"
                title="Saimniecības traktortehnika"
            />
          </div>
          <div class="col">
              <EquipmentInformationTable
                  :equipment-types="['mowers']"
                  title="Saimniecības traktortehnika"
              />
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import PropertyInformation from "@/components/PropertyInformation.vue";
import EquipmentInformationTable from "@/components/table/EquipmentInformationTable.vue";
const equipmentCollectionStore = useEquipmentCollectionStore();
const onEquipmentAdded = (item: IEquipmentInformation) => {
    equipmentCollectionStore.pushItem(item);
}
</script>

<style scoped>

</style>
