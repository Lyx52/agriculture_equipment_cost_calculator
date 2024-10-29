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
            </div>
            <div class="row">
                <div class="col">
                    <div class="mt-2 d-flex flex-row gap-1">
                        <BFormSelect
                            v-model="chartStateStore.selectedChartColumn"
                            :options="chartStateStore.getDataColumns"
                        />
                        <div class="input-group ms-1">
                            <span class="input-group-text" id="graphTypeMain">Grafika tips</span>
                            <BFormSelect
                                v-model="chartStateStore.selectedChartType"
                                :options="chartStateStore.getChartTypes"
                                aria-label="Grafika tips"
                                aria-describedby="graphTypeMain"
                            />
                        </div>
                        <div class="input-group">
                            <span class="input-group-text" id="graphAggreagtionTypeMain">Agregācija</span>
                            <BFormSelect
                                v-model="chartStateStore.selectedChartAggregation"
                                :options="chartStateStore.getChartAggregationTypes"
                                aria-label="Agregācija"
                                aria-describedby="graphAggreagtionTypeMain"
                            />
                        </div>
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
                        <div class="input-group ms-1">
                            <span class="input-group-text" :id="`graphType__${column.columnKey}`">Grafika tips</span>
                            <BFormSelect
                                v-model="column.chartType"
                                @change="chartStateStore.buildChart"
                                :options="chartStateStore.getChartTypes"
                                aria-label="Grafika tips"
                                :aria-describedby="`graphType__${column.columnKey}`"
                            />
                        </div>
                        <div class="input-group">
                            <span class="input-group-text" :id="`graphAggregationType__${column.columnKey}`">Agregācija</span>
                            <BFormSelect
                                v-model="column.chartAggregation"
                                @change="chartStateStore.buildChart"
                                :options="chartStateStore.getChartAggregationTypes"
                                aria-label="Agregācija"
                                :aria-describedby="`graphAggregationType__${column.columnKey}`"
                            />
                        </div>
                        <BButtonGroup>
                            <BButton variant="danger" @click="chartStateStore.removeColumn(column.uniqueId)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                                </svg>
                            </BButton>
                            <BButton variant="success" @click="chartStateStore.downloadDataset(column.uniqueId)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
                                    <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                                </svg>
                            </BButton>
                        </BButtonGroup>
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
