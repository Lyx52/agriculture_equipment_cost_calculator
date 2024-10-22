<template>
    <div>
    <BButton @click="showModal = !showModal"> Attēlot grafikā (Jauns) </BButton>
        <BModal class="modal-xl" v-model="showModal" :hideFooter="true">
            <div class="container-fluid">
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
                    <div id="inputGroupByContainer" class="col mt-3">
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
                    <div class="col mt-3" id="aggregationTypeContainer" style="display: none;">
                        <div class="input-group mt-auto">
                            <span class="input-group-text" id="aggregationType">Agregācija</span>
                            <select id="inputAggregationType" class="form-control" aria-label="Grafika tips" aria-describedby="aggregationType">
                                <option value="avg" selected>Vidējais</option>
                                <option value="max">Maksimālais</option>
                                <option value="min">Minimālais</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row row-cols-2">
                    <div class="col mt-auto d-flex gap-2 flex-column">
                        <div id="graphSelectContainer1" class="d-flex flex-row gap-2">
                            <div class="mb-auto mt-auto w-auto">
                            </div>
                            <div class="form-group mt-auto mb-auto ml-auto">
                                <select class="form-control" id="graphSelectColumn1">
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col mt-auto d-flex flex-column flex-md-row">
                        <div class="form-group mt-2 mt-md-auto ms-auto">
                            <label for="movingAverage">Slīdošais vidējais (SMA)</label>
                            <select id="movingAverage" class="form-select">
                                <option value="-1">Nav</option>
                                <option value="5">5 mērījumi</option>
                                <option value="10">10 mērījumi</option>
                                <option value="25">25 mērījumi</option>
                                <option value="50">50 mērījumi</option>
                                <option value="75">75 mērījumi</option>
                                <option value="100">100 mērījumi</option>
                                <option value="250">250 mērījumi</option>
                                <option value="500">500 mērījumi</option>
                            </select>
                        </div>
                        <button id="downloadCsv" class="btn btn-success ms-3 mt-2 mt-md-auto">Lejupielādēt</button>
                        <button id="resetSelectContainers" class="btn btn-danger d-flex ms-3 mt-2 mt-md-auto">Attiestatīt</button>
                        <button id="addSelectContainer" class="btn btn-success d-flex ms-3 mt-2 mt-md-auto">Pievienot</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                      <DynamicChart />
                    </div>
                </div>
            </div>
        </BModal>
    </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js'
import {BModal, BButton, BFormGroup, BFormInput, BDropdown, BDropdownItem, BBadge, BPopover, BFormSelect} from "bootstrap-vue-next";
import {defineComponent, onMounted, ref, toRefs} from "vue";
import {useChartStateStore} from "@/stores/chartState";
import DynamicChart from "@/components/DynamicChart.vue";
const chartStateStore = useChartStateStore();
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement)
const showModal = ref<boolean>(false);
onMounted(async () => {
  await chartStateStore.fetchTableData('combined');
});
</script>

<style scoped>
</style>
