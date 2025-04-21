<template>
  <div class="d-flex flex-column max-h-75vh">
    <div class="d-flex flex-row graph-header mb-3">
      <BButton class="ms-3" v-if="selectedGraphType !== 'total'" @click="prevGraph">
        <IconArrowLeft /> Atpakaļ
      </BButton>
      <BInputGroup prepend="Aprēķināt" class="w-50 ms-auto">
        <BFormSelect :options="calculatePerOptions" v-model="selectedCalculatePer" />
      </BInputGroup>
    </div>
    <div class="d-flex">
      <h5 class="ms-4 text-center w-fit-content">{{ graphTitle }}</h5>
      <BPopover placement="left">
        <template #default>Uzspiežot uz stabiņa redz detalizētu informāciju</template>
        <template #target>
          <BBadge class="ms-auto my-auto p-1">
            <IconInfo />
          </BBadge>
        </template>
      </BPopover>
    </div>
    <Bar
      :options="options"
      :data="data"
    />
  </div>
</template>

<style lang="scss">
.graph-header {
  height: 50px;
}
.max-h-75vh {
  max-height: 75vh;
}
.w-fit-content {
  width: fit-content;
}
</style>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
  type ChartData,
  type DefaultDataPoint,
  type ActiveElement,
  type ChartEvent
} from 'chart.js'
import { ref, toRefs, watch } from 'vue'
import { useOperationStore } from '@/stores/operation.ts'
import { usePrefetchStore } from '@/stores/prefetch.ts'
import { first, groupedBy, sumBy } from '@/utils.ts'
import type { OperationModel } from '@/stores/model/operationModel.ts'
import { BFormSelect, BInputGroup, BButton, BBadge, BPopover } from 'bootstrap-vue-next'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconInfo from '@/components/icons/IconInfo.vue'
Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const selectedCalculatePer = ref<string>('ha');
const selectedCostType = ref<number>(-1);
const selectedGraphType = ref<string>('total');
const selectedFarmlandGroup = ref<string|undefined>(undefined);
const currentGroups = ref<string[]>([]);
const calculatePerOptions = [
  { value: 'kopā', text: 'kopā' },
  { value: 'h', text: 'stundā' },
  { value: 'ha', text: 'hektārā' },
];

const operationStore = useOperationStore();
const prefetchStore = usePrefetchStore();
const labels = [
  "Amortizācija, EUR/ha",
  "Darbaspēka izmaksas, EUR/ha",
  "Remonta izmaksas, EUR/ha",
  "Degvielas izmaksas, EUR/ha",
  "Smērvielu izmaksas, EUR/ha",
];
const graphTitle = ref<string>('Visas izmaksas');
const data = ref<ChartData<'bar', DefaultDataPoint<'bar'>, unknown>>({
  labels,
  datasets: [
    {
      backgroundColor: '#f45c2e',
      data: [],
    },
  ]
});


const {
  isLoading
} = toRefs(prefetchStore);

const getCostType = (costType: number) => {
  switch(costType) {
    case 0: return 'Amortizācijas';
    case 1: return 'Darbaspēka';
    case 2: return 'Remonta';
    case 3: return 'Degvielas';
    case 4: return 'Smērvielu';
  }
  return '';
}

const getOperationCostCalcByType = (costType: number, calculatePer: string): ((item: OperationModel) => number) => {
  switch(costType) {
    case 0: return (operation: OperationModel) => operation.depreciationValue(calculatePer);
    case 1: return (operation: OperationModel) => operation.equipmentOperatorWageCosts(calculatePer);
    case 2: return (operation: OperationModel) => operation.accumulatedRepairCosts(calculatePer);
    case 3: return (operation: OperationModel) => operation.totalFuelCosts(calculatePer);
    case 4: return (operation: OperationModel) => operation.lubricationCosts(calculatePer);
  }

  return (operation: OperationModel) => operation.depreciationValue('ha');
}

const getDataset = (costType: number, calculatePer: string, groupByDepth: number = 0) => {
  const costCalcFunc = getOperationCostCalcByType(costType, calculatePer);
  const groupLabels = [];
  const groupData = [];
  // Group by farmlands
  let groups = groupedBy(operationStore.items, (operation: OperationModel) => operation.farmland?.displayName ?? 'Bez lauka');

  // Group by selected farmland operations
  if (groupByDepth >= 1) {
    groups = groupedBy(groups[selectedFarmlandGroup.value!], (operation: OperationModel) => operation.displayName);
  }

  for (const [group, items] of Object.entries(groups)) {
    groupLabels.push(group);
    groupData.push(sumBy(items, costCalcFunc));
  }

  currentGroups.value = groupLabels;

  return {
    labels: groupLabels,
    datasets: [
      {
        backgroundColor: '#f45c2e',
        data: groupData,
      }
    ]
  }
}

const getTotalsDataset = (calculatePer: string) => {
  currentGroups.value = [];
  return {
    labels,
    datasets: [
      {
        backgroundColor: '#f45c2e',
        data: [
          sumBy(operationStore.items, (operation: OperationModel) => operation.depreciationValue(calculatePer)),
          sumBy(operationStore.items, (operation: OperationModel) => operation.equipmentOperatorWageCosts(calculatePer)),
          sumBy(operationStore.items, (operation: OperationModel) => operation.accumulatedRepairCosts(calculatePer)),
          sumBy(operationStore.items, (operation: OperationModel) => operation.totalFuelCosts(calculatePer)),
          sumBy(operationStore.items, (operation: OperationModel) => operation.lubricationCosts(calculatePer)),
        ]
      },
    ]
  }
}

const getDatasetByGraphType = (graphType: string, calculatePer: string, costType: number): ChartData<'bar', DefaultDataPoint<'bar'>, unknown> => {
  switch(graphType) {
    case 'total': return getTotalsDataset(calculatePer);
    case 'farmland': return getDataset(costType, calculatePer, 0);
    case 'operation': return getDataset(costType, calculatePer, 1);
  }

  return {
    labels,
    datasets: [
      {
        backgroundColor: '#f45c2e',
        data: [],
      },
    ]
  }
}

watch(isLoading, () => {
  data.value = getDatasetByGraphType(selectedGraphType.value, selectedCalculatePer.value, selectedCostType.value);
});

watch(selectedCalculatePer, (newSelectedCalculatePer) => {
  data.value = getDatasetByGraphType(selectedGraphType.value, newSelectedCalculatePer, selectedCostType.value);
});

watch(selectedCostType, (newSelectedElementIndex) => {
  data.value = getDatasetByGraphType(selectedGraphType.value, selectedCalculatePer.value, newSelectedElementIndex);
});

watch(selectedGraphType, (newSelectedGraphType) => {
  data.value = getDatasetByGraphType(newSelectedGraphType, selectedCalculatePer.value, selectedCostType.value);
});


const nextGraph = (index: number) => {
  switch(selectedGraphType.value) {
    case 'total':
      selectedGraphType.value = 'farmland';
      selectedCostType.value = index;
      graphTitle.value = `${getCostType(selectedCostType.value)} izmaksas, pēc laukiem`;
      break;
    case 'farmland':
      selectedGraphType.value = 'operation';
      selectedFarmlandGroup.value = currentGroups.value[index];
      graphTitle.value = `${getCostType(selectedCostType.value)} izmaksas, pēc ${selectedFarmlandGroup.value} lauka operācijām`;
      break;
  }
  selectedCalculatePer.value = 'kopā';
}

const prevGraph = () => {
  switch(selectedGraphType.value) {
    case 'farmland':
      selectedGraphType.value = 'total';
      selectedCostType.value = -1;
      selectedCalculatePer.value = 'ha';
      graphTitle.value = 'Visas izmaksas';
      break;
    case 'operation':
      selectedGraphType.value = 'farmland';
      selectedFarmlandGroup.value = undefined;
      selectedCalculatePer.value = 'kopā';
      graphTitle.value = `Izmaksas ${getCostType(selectedCostType.value)}, pēc laukiem`;
      break;
  }
}

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    }
  },
  scales: {
    y: {
      ticks: {
        callback: function(value) {
          return `${typeof value !== 'string' ? value?.toFixed(2) : value} €`;
        }
      }
    }
  },
  onClick(event: ChartEvent, elements: ActiveElement[], _: Chart) {
    const element = first<ActiveElement>(elements);
    if (!element) return;
    nextGraph(element.index);
  }
}


</script>
