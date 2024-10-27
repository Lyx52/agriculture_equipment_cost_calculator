<template>
    <div>
    <BButton @click="showModal = !showModal"> Attēlot grafikā (Jaunā versija) </BButton>
        <BWorkflowModal :is-spinning="chartStateStore.isLoading" v-model="showModal">
            <div class="row row-cols-2 mb-3">
                <div class="col mt-3">
                  <div class="input-group mt-auto">
                    <span class="input-group-text" id="dateLabelFrom">Līdz</span>
                    <BFormInput
                        type="date"
                        id="dateFrom"
                        @change="chartStateStore.buildChart"
                        v-model="chartStateStore.dateFrom"
                        aria-label="No"
                        aria-describedby="dateLabelFrom"
                    />
                  </div>
                </div>
                <div class="col mt-3">
                    <div class="input-group mt-auto">
                        <span class="input-group-text" id="dateLabelTo">Līdz</span>
                        <BFormInput
                            type="date"
                            id="dateTo"
                            @change="chartStateStore.buildChart"
                            v-model="chartStateStore.dateTo"
                            aria-label="Līdz"
                            aria-describedby="dateLabelTo"
                        />
                    </div>
                </div>
                <div class="col mt-3">
                    <div class="input-group mt-auto">
                        <span class="input-group-text" id="groupBy">Grupēt pēc</span>
                        <BFormSelect
                            v-model="chartStateStore.groupBy"
                            @change="chartStateStore.buildChart"
                            :options="chartStateStore.getGroupingTableColumns"
                            aria-label="Grupēt pēc"
                            aria-describedby="groupBy"
                        />
                    </div>
                </div>
                <div class="col mt-3">
                    <div class="input-group mt-auto">
                        <span class="input-group-text" id="graphType">Grafika tips</span>
                        <BFormSelect
                            v-model="chartStateStore.chartType"
                            @change="chartStateStore.buildChart"
                            :options="chartStateStore.getChartTypes"
                            aria-label="Grafika tips"
                            aria-describedby="graphType"
                        />
                    </div>
                </div>
            </div>
            <div class="row row-cols-2">
                <div class="col">
                    <div class="mt-2 d-flex flex-row gap-1">
                        <BFormSelect
                            v-model="chartStateStore.selectedChartColumn"
                            @change="chartStateStore.buildChart"
                            :options="chartStateStore.getDataColumns"
                        />
                        <BButtonGroup>
                            <BButton variant="success" @click="chartStateStore.addColumn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </BButton>
                        </BButtonGroup>
                    </div>
                    <div class="mt-2 d-flex flex-row gap-1" v-for="column in chartStateStore.chartColumns">
                        <BFormSelect
                            v-model="column.columnKey"
                            @change="chartStateStore.buildChart"
                            :options="chartStateStore.getAllDataColumns"
                        />
                        <BButtonGroup>
                            <BButton variant="danger" @click="chartStateStore.removeColumn(column.columnKey)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                                </svg>
                            </BButton>
                        </BButtonGroup>
                    </div>
                </div>
                <div class="col">
                    <div class="input-group mt-2">
                        <span class="input-group-text" id="graphType">Agregācija</span>
                        <BFormSelect
                            v-model="chartStateStore.chartAggregation"
                            @change="chartStateStore.buildChart"
                            :options="chartStateStore.getChartAggregationTypes"
                            aria-label="Grafika tips"
                            aria-describedby="graphType"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <BarChart />
                </div>
            </div>
        </BWorkflowModal>
    </div>
</template>

<script setup lang="ts">
import {BButton, BFormInput, BFormSelect, BButtonGroup} from "bootstrap-vue-next";
import {onMounted, ref} from "vue";
import {useChartStateStore} from "@/stores/chartState";
import BWorkflowModal from "@/components/BWorkflowModal.vue";
import BarChart from "@/components/Chart.vue";
import {getCurrentTable} from "@/utils";

const chartStateStore = useChartStateStore();
const showModal = ref<boolean>(false);
onMounted(async () => {
  await chartStateStore.fetchTableData(getCurrentTable());
});
</script>

<style scoped>
</style>
