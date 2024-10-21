<template>
    <div>
    <BButton @click="showModal = !showModal"> Attēlot grafikā (Jauns) </BButton>
        <BModal class="modal-xl" v-model="showModal" :hideFooter="true">
            <div class="container-fluid">
                <div id="dateBlock" class="row row-cols-2 mb-3">
                    <div class="col mt-3">
                        <div class="input-group mt-auto">
                            <span class="input-group-text" id="dt-from">No</span>
                            <input id="inputDateFrom" type="date" class="form-control" aria-label="No" aria-describedby="dt-from">
                        </div>
                    </div>
                    <div class="col mt-3">
                        <div class="input-group mt-auto">
                            <span class="input-group-text" id="dt-to">Līdz</span>
                            <input id="inputDateTo" type="date" class="form-control" aria-label="Līdz" aria-describedby="dt-to">
                        </div>
                    </div>
                    <div id="inputGroupByContainer" class="col mt-3">
                        <div class="input-group mt-auto">
                            <span class="input-group-text" id="groupBy">Grupēt pēc</span>
                            <select id="inputGroupBy" class="form-control" aria-label="Grupēt pēc" aria-describedby="groupBy">
                            </select>
                        </div>
                    </div>
                    <div id="selectableXColumnContainer" class="col mt-3" style="display: none;">
                        <span class="input-group-text" id="groupBy">Grupēt pēc X kolonnām</span>
                        <ol id="selectableXColumn">
                        </ol>
                    </div>

                    <div class="col mt-3">
                        <div class="input-group mt-auto">
                            <span class="input-group-text" id="graphType">Grafika tips</span>
                            <select id="inputGraphType" class="form-control" aria-label="Grafika tips" aria-describedby="graphType">

                            </select>
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
                        <button id="drawGraph" class="btn btn-secondary d-flex ms-3 mt-2 mt-md-auto">Radīt</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <Bar :data="data" :options="options" />
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
    LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import {BModal, BButton, BFormGroup, BFormInput, BDropdown, BDropdownItem, BBadge, BPopover, BFormSelect} from "bootstrap-vue-next";
import {ref} from "vue";
import {  data, options } from '@/chartConfig'


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const showModal = ref<boolean>(false);

</script>

<style scoped>
</style>