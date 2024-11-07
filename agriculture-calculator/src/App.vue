<template>
  <div class="container-fluid my-3">
      <div class="d-flex flex-column flex-nowrap mb-3">
          <PropertyInformation />
      </div>
      <div class="row">
          <div class="col">
              <div class="card">
                    <div class="card-header">
                        <ul class="nav nav-tabs card-header-tabs bg-transparent">
                            <li class="nav-item">
                                <a class="nav-link text-black cursor-pointer" :class="{
                                active: currentTab == 0
                            }" @click="switchTo(0)">Traktortehnika</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-black cursor-pointer" :class="{
                                active: currentTab == 1
                            }" @click="switchTo(1)">Kombaini</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-black cursor-pointer" :class="{
                                active: currentTab == 2
                            }" @click="switchTo(2)">Traktortehnikas aprīkojums</a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                            <div class="tab-pane" :class="{
                                active: currentTab == 0
                            }" id="tractorsPane" role="tabpanel">

                                <EquipmentInformationTable
                                    :equipment-types="currentEquipmentFilter"
                                    title="Traktortehnika"
                                    :search-form-index="0"
                                />
                            </div>
                            <div class="tab-pane" :class="{
                                active: currentTab == 1
                            }" id="tractorsPane" role="tabpanel">
                                <EquipmentInformationTable
                                    :equipment-types="['agricultural_harvesters']"
                                    title="Kombaini"
                                    :search-form-index="1"
                                />
                            </div>
                            <div class="tab-pane" :class="{
                                active: currentTab == 2
                            }" id="equipmentPane" role="tabpanel">
                                <EquipmentInformationTable
                                    :equipment-types="['sowing_and_plant_care_machines']"
                                    title="Traktortehnika aprīkojums"
                                    :search-form-index="2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <TechnicalEquipmentModal
          v-model="equipmentFilterStore.showSearchModal"
          :equipment-types="currentEquipmentFilter"
          :search-form-index="currentTab"
        />
    </div>
</template>

<script setup lang="ts">
import PropertyInformation from "@/components/PropertyInformation.vue";
import EquipmentInformationTable from "@/components/table/EquipmentInformationTable.vue";
import {onMounted, ref} from "vue";
import TechnicalEquipmentModal from "@/components/modal/TechnicalEquipmentModal.vue";
import {useEquipmentFilterStore} from "@/stores/equipmentFilter";
const currentTab = ref<number>(0);
const currentEquipmentFilter = ref<string[]>(['tractors']);
const equipmentFilterStore = useEquipmentFilterStore();
onMounted(async () => {
    await equipmentFilterStore.fetchEquipmentCategories();
})
const switchTo = async (tab: number) => {
    equipmentFilterStore.resetFilter();
    switch (tab) {
        case 0: {
            currentEquipmentFilter.value = ['tractors'];
            equipmentFilterStore.selectedCategory = 'tractors';
            equipmentFilterStore.selectedSubCategory = 'agriculture_tractor';
            await equipmentFilterStore.fetchMark();
            console.log(equipmentFilterStore.selectedSubCategory);
        } break;
        case 1: {
            currentEquipmentFilter.value = ['agricultural_harvesters'];
            equipmentFilterStore.selectedCategory = 'agricultural_harvesters';
            equipmentFilterStore.selectedSubCategory = '';
        } break;
        case 2: {
            currentEquipmentFilter.value = ['sowing_and_plant_care_machines'];
            equipmentFilterStore.selectedCategory = '';
            equipmentFilterStore.selectedSubCategory = '';
        } break;
    }
    currentTab.value = tab;
}


</script>

<style scoped>

</style>
