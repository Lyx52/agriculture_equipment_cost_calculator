<template>
  <div class="container-fluid my-3">
      <div class="row row-cols-2">
          <div class="col">
              <div class="d-flex flex-column flex-nowrap w-100 mb-3">
                  <GeneralInformation />
              </div>
          </div>
          <div class="col">
              <div class="d-flex flex-column flex-nowrap w-100 mb-3">
                  <UsedFarmlandTable />
              </div>
          </div>
      </div>
      <div class="row">
          <div class="col">
              <div class="card shadow">
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
              <div class="card shadow">
                  <div class="card-body">
                        <CostCalculatorTable />
                  </div>
              </div>
          </div>
      </div>
      <div class="row mt-3">
          <div class="col">
              <BAccordion free class="shadow">
                  <BAccordionItem title="Īpašuma izmaksu novērtējums, EUR" visible>
                      <PropertyCostEstimationTable />
                  </BAccordionItem>
                  <BAccordionItem title="Ekspluatācijas izmaksu novērtējums">
                      <OperationCostEstimationTable />
                  </BAccordionItem>
              </BAccordion>

          </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import {BAccordion, BAccordionItem} from 'bootstrap-vue-next'
import GeneralInformation from "@/components/GeneralInformation.vue";
import EquipmentInformationTable from "@/components/table/EquipmentInformationTable.vue";
import {ref} from "vue";
import CostCalculatorTable from "@/components/form/OperationsTable.vue";
import {EquipmentTypeCategories, type EquipmentTypeCategory} from "@/stores/constants/EquipmentTypes";
import PropertyCostEstimationTable from "@/components/form/PropertyCostEstimationTable.vue";
import OperationCostEstimationTable from "@/components/form/OperationCostEstimationTable.vue";
import UsedFarmlandTable from "@/components/form/UsedFarmlandTable.vue";
const currentTab = ref<EquipmentTypeCategory>('tractor');

const switchTo = (tabCategory: EquipmentTypeCategory) => {
    currentTab.value = tabCategory;
}


</script>

<style scoped>

</style>
