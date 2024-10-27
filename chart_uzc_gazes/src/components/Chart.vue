<template>
    <div class="chart-container mt-2">
        <BButton class="ms-auto" variant="secondary" @click="resetZoom">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-gear" viewBox="0 0 16 16">
                <path d="M7.293 1.5a1 1 0 0 1 1.414 0L11 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l2.354 2.353a.5.5 0 0 1-.708.708L8 2.207l-5 5V13.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 2 13.5V8.207l-.646.647a.5.5 0 1 1-.708-.708z"/>
                <path d="M11.886 9.46c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.044c-.613-.181-.613-1.049 0-1.23l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
            </svg>
        </BButton>
        <Bar
            ref="chartBar"
            v-if="chartStateStore.chartType === 'Bar'"
            :options="options"
            :data="{
                datasets: datasets,
                labels: labels
            }"
        />
        <Bar
            ref="chartBarAndLine"
            v-if="chartStateStore.chartType === 'BarAndLine'"
            :options="options"
            :data="{
                datasets: datasets,
                labels: labels
            }"
        />
        <Doughnut
            ref="chartDoughnut"
            v-if="chartStateStore.chartType === 'Doughnut'"
            :options="options"
            :data="{
                datasets: datasets,
                labels: labels
            }"
        />
        <Pie
            ref="chartPie"
            v-if="chartStateStore.chartType === 'Pie'"
            :options="options"
            :data="{
                datasets: datasets,
                labels: labels
            }"
        />
        <Line
            ref="chartLine"
            v-if="chartStateStore.chartType === 'Line'"
            :options="options"
            :data="{
                datasets: datasets,
                labels: labels
            }"
        />
        <PolarArea
            ref="chartPolarArea"
            v-if="chartStateStore.chartType === 'PolarArea'"
            :options="options"
            :data="{
                datasets: datasets,
                labels: labels
            }"
        />
    </div>
</template>

<script setup lang="ts">
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    RadialLinearScale
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
ChartJS.register(
    zoomPlugin,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    RadialLinearScale,
);
import {Bar, Line, Doughnut, Pie, Scatter, PolarArea, type ChartComponentRef} from "vue-chartjs";
import {useChartStateStore} from "@/stores/chartState";
import {ref, useTemplateRef} from "vue";
import {BButton} from "bootstrap-vue-next";

const datasets = ref<any[]>([]);
const labels = ref<string[]>([]);
const chartLineRef = useTemplateRef<ChartComponentRef>('chartLine');
const chartBarRef = useTemplateRef<ChartComponentRef>('chartBar');
const chartBarAndLineRef = useTemplateRef<ChartComponentRef>('chartBarAndLine');
const chartDoughnutRef = useTemplateRef<ChartComponentRef>('chartDoughnut');
const chartPolarAreaRef = useTemplateRef<ChartComponentRef>('chartPolarArea');
const chartPieRef = useTemplateRef<ChartComponentRef>('chartPie');

const resetZoom = () => {
    if (chartLineRef?.value?.chart) chartLineRef.value.chart.resetZoom();
    if (chartBarRef?.value?.chart) chartBarRef.value.chart.resetZoom();
    if (chartBarAndLineRef?.value?.chart) chartBarAndLineRef.value.chart.resetZoom();
    if (chartDoughnutRef?.value?.chart) chartDoughnutRef.value.chart.resetZoom();
    if (chartPolarAreaRef?.value?.chart) chartPolarAreaRef.value.chart.resetZoom();
    if (chartPieRef?.value?.chart) chartPieRef.value.chart.resetZoom();
}
const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        autoPadding: true
    },
    plugins: {
        zoom: {
            pan: {
                enabled: true,
                mode: 'xy',
                modifierKey: 'ctrl',
            },
            zoom: {
                mode: 'xy',
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                drag: {
                    enabled: true,
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1,
                    backgroundColor: 'rgba(54, 162, 235, 0.3)',
                },
            },
        },
    },
} as any;
const chartStateStore = useChartStateStore();
chartStateStore.$subscribe((mutation, state) => {
    labels.value = chartStateStore.chartData.labels;
    datasets.value = chartStateStore.chartData.datasets;
})
</script>

<style scoped>
    .chart-container {
        display: flex;
        flex-flow: column;
        min-height: 50vh !important;
        max-height: 65vh !important;
    }
</style>