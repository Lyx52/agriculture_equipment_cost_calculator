<template>
  <Bar
      v-if="chartStateStore.chartType === 'bar'"
      :data="barChartData"
      :options="options"
  />
  <Line
      v-if="chartStateStore.chartType === 'line'"
      :data="lineChartData"
      :options="options"
  />
  <Bar
      v-if="chartStateStore.chartType === 'bar_and_line'"
      :data="barAndLineChartData"
      :options="options"
  />
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
  LinearScale, type ChartData
} from 'chart.js';
import { Bar, Line,  } from 'vue-chartjs';

import {useChartStateStore} from "@/stores/chartState";
import {ref} from "vue";
const options = {
  responsive: true,
  maintainAspectRatio: false
};
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, CategoryScale, LinearScale);
const chartStateStore = useChartStateStore();

const barChartData = ref<ChartData<'bar'>>({
  datasets: [],
  labels: []
});

const lineChartData = ref<ChartData<'line'>>({
  datasets: [],
  labels: []
});

const barAndLineChartData = ref<ChartData<'bar'>>({
  datasets: [],
  labels: []
});

chartStateStore.$subscribe((mutation, state) => {
  barChartData.value = {
    labels: [
      ...state.chartLabels
    ],
    datasets: [
      ...state.chartDatasets
    ]
  };

  lineChartData.value = {
    labels: [
      ...state.chartLabels
    ],
    datasets: [
      ...state.chartDatasets
    ]
  };

  barAndLineChartData.value = {
    labels: [
      ...state.chartLabels
    ],
    datasets: [
      ...state.chartDatasets
    ]
  };
});
</script>

<style scoped>

</style>
