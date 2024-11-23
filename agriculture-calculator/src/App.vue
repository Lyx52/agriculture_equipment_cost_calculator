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
                            <li class="nav-item" v-for="[category, categoryName] in Object.entries(EquipmentTypeCategories)">
                                <a class="nav-link text-black cursor-pointer" :class="{
                                active: currentTab == category
                            }" @click="switchTo(category as EquipmentTypeCategory)">{{ categoryName }}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                            <div
                                v-for="category in Object.keys(EquipmentTypeCategories)"
                                class="tab-pane"
                                :class="{
                                    active: currentTab === category
                                }"
                                role="tabpanel"
                            >
                                <EquipmentInformationTable
                                    :equipment-type-category="category as EquipmentTypeCategory"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      <div class="row mt-3">
          <div class="col">
              <div class="card">
                  <div class="card-body">
                        <CostCalculatorTable />
                  </div>
              </div>
          </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import PropertyInformation from "@/components/PropertyInformation.vue";
import EquipmentInformationTable from "@/components/table/EquipmentInformationTable.vue";
import {ref} from "vue";
import CostCalculatorTable from "@/components/form/OperationsTable.vue";
import {EquipmentTypeCategories, type EquipmentTypeCategory} from "@/stores/constants/EquipmentTypes";
const currentTab = ref<EquipmentTypeCategory>('tractor');

const switchTo = (tabCategory: EquipmentTypeCategory) => {
    currentTab.value = tabCategory;
}


</script>

<style scoped>

</style>
