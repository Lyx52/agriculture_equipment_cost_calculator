<template>
    <div class="chart-container mt-2">
        <div class="ms-auto d-flex flex-row gap-2">
            <BButton :class="{
                'btn-success': chartStateStore.chartData.dataHidden,
                'btn-danger': !chartStateStore.chartData.dataHidden
            }" @click="onClickHideCharts">
                {{ chartStateStore.chartData.dataHidden ? 'Parādīt' : 'Paslēpt' }} datus
            </BButton>
            <BButton variant="secondary" @click="resetZoom">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-gear" viewBox="0 0 16 16">
                    <path d="M7.293 1.5a1 1 0 0 1 1.414 0L11 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l2.354 2.353a.5.5 0 0 1-.708.708L8 2.207l-5 5V13.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 2 13.5V8.207l-.646.647a.5.5 0 1 1-.708-.708z"/>
                    <path d="M11.886 9.46c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.044c-.613-.181-.613-1.049 0-1.23l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                </svg>
            </BButton>
        </div>
        <Bar
            ref="chartRef"
            :options="options"
            :data="data"
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
    RadialLinearScale,
    LineController,
    BarController,
    Chart,
    type ChartData,
    type ChartOptions,
    type ChartMeta,
    type ChartConfiguration
} from 'chart.js';
import { HierarchicalScale } from 'chartjs-plugin-hierarchical';
import ZoomPlugin from 'chartjs-plugin-zoom';
ChartJS.register(
    ZoomPlugin,
    LabelPlugin,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    LineController,
    BarController,
    CategoryScale,
    LinearScale,
    ArcElement,
    RadialLinearScale,
    HierarchicalScale
);
import {Bar, Line, type ChartComponentRef} from "vue-chartjs";
import {useChartStateStore} from "@/stores/chartState";
import {ref, toRefs, useTemplateRef, watch} from "vue";
import {BButton} from "bootstrap-vue-next";
import LabelPlugin from "@/plugins/LabelPlugin";


const data = ref<ChartData<'bar'>>({
    datasets: [],
});
const chartRef = useTemplateRef<ChartComponentRef>('chartRef');
const resetZoom = () => {
  if (chartRef?.value?.chart) {
      chartRef?.value?.chart.resetZoom();
  }
}

const options = ref<ChartOptions<'bar'>>({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            // add more space at the bottom for the hierarchy
            bottom: 200,
        }
    },
});
const chartStateStore = useChartStateStore();
const {
    chartData,
    extraOptions
} = toRefs(chartStateStore);
watch(chartData, () => {
    updateCharts()
})
const onClickHideCharts = () => {
    chartData.value.dataHidden = !chartData.value.dataHidden;
    updateCharts();
}
const updateCharts = () => {
    data.value = {
        labels: chartData.value.labels,
        datasets: chartData.value.datasets
    }
    options.value = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                // add more space at the bottom for the hierarchy
                bottom: 200,
            }
        },
        ...extraOptions.value
    }
    setAllDatasetVisibility(!chartData.value.dataHidden);
}
const setAllDatasetVisibility = (visibility: boolean) => {
    if (chartRef?.value?.chart) {
        for (let i = 0; i < chartRef.value.chart.data.datasets.length; i++) {
            chartRef.value.chart.setDatasetVisibility(i, visibility);
        }
        chartRef.value.chart.update();
    }
}
</script>

<style scoped>
    .chart-container {
        display: flex;
        flex-flow: column;
        min-height: 50vh !important;
        max-height: 65vh !important;
    }
</style>
