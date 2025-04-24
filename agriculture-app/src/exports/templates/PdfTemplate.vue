
<script setup lang="ts">
/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale, type ChartType
} from 'chart.js'
import autocolors from 'chartjs-plugin-autocolors';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, autocolors)

import type { IPdfTemplateProps } from '@/props/IPdfTemplateProps.ts'
import { onMounted, useTemplateRef } from 'vue'
import { dateToString, DisplayNumber, renderChartJs, sumBy } from '@/utils.ts'
import { ChartConstants } from '@/constants/ChartConstants.ts'
import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'
import type { OperationModel } from '@/stores/model/operationModel.ts'
import { AppVersionNumber } from '@/main.ts'
const props = defineProps<IPdfTemplateProps>();

const buildChartOptions = (chartTitle: string, yAxisTitle: string, xAxisTitle: string) => {
  return {
    responsive: false,
    maintainAspectRatio: false,
    animation: false,
    grouped: true,
    layout: {
      padding: 10
    },
    plugins: {
      title: {
        display: true,
        text: chartTitle,
        font: ChartConstants.LargeTextFontBold
      },
      autocolors: {
        enabled: true
      },
      legend: {
        display: true,
        position: 'bottom'
      }
    },
    scales: {
      y: {
        ticks: {
          callback: ChartConstants.FormatterDisplayNumber,
        },
        title: {
          display: yAxisTitle.length > 0,
          text: yAxisTitle,
          font: ChartConstants.MediumTextFontBold
        }
      },
      x: {
        ticks: false,
        title: {
          display: xAxisTitle.length > 0,
          text: xAxisTitle,
          font: ChartConstants.MediumTextFontBold
        }
      }
    }
  };
}

const buildChartByOperations = (farmland: FarmlandModel) => {
  const datasets = [];
  const labels = [];
  for (const operation of farmland.operations) {
    labels.push(`${operation.displayName}, ${operation.equipmentOrExternalServiceDisplayName}`);
    datasets.push({
      label: `${operation.displayName}, ${operation.equipmentOrExternalServiceDisplayName}`,
      data: [operation.totalOperatingCosts('ha')]
    });
  }
  return {
    data: {
      datasets,
      labels,
    },
    options: buildChartOptions('Izmaksu sadalījums pa apstrādes operācijām', 'EUR/ha', 'Izmaksu pozīcija')
  }
}

const buildChartCostDivision = (farmland: FarmlandModel) => {
  const labels = [''];
  const datasets = [
    {
      label: 'Ieņēmumi',
      data: [farmland.totalEarnings]
    },
    {
      label: 'Atbalsts',
      data: [farmland.totalAgriculturalSupportAdjustments]
    },
    {
      label: 'Mainīgās izmaksas',
      data: [farmland.materialCostsTotal]
    },
    {
      label: 'Eksplautācijas izmaksas',
      data: [farmland.totalOperatingCosts]
    }
  ];
  return {
    data: {
      datasets,
      labels,
    },
    options: buildChartOptions('Izmaksu sadalījums', 'EUR', 'Izmaksu pozīcija')
  }
}

const buildChartByOperatingCost = (farmland: FarmlandModel) => {
  const labels = [''];
  const datasets = [
    {
      label: 'Amortizācija, EUR/ha',
      data: [sumBy(farmland.operations, (operation: OperationModel) => operation.depreciationValue('ha'))]
    },
    {
      label: 'Darbaspēka izmaksas, EUR/ha',
      data: [sumBy(farmland.operations, (operation: OperationModel) => operation.equipmentOperatorWageCosts('ha'))]
    },
    {
      label: 'Remonta izmaksas, EUR/ha',
      data: [sumBy(farmland.operations, (operation: OperationModel) => operation.accumulatedRepairCosts('ha'))]
    },
    {
      label: 'Degvielas izmaksas, EUR/ha ',
      data: [sumBy(farmland.operations, (operation: OperationModel) => operation.totalFuelCosts('ha'))]
    },
    {
      label: 'Smērvielu izmaksas, EUR/ha',
      data: [sumBy(farmland.operations, (operation: OperationModel) => operation.lubricationCosts('ha'))]
    },
  ];
  return {
    data: {
      datasets,
      labels,
    },
    options: buildChartOptions('Eksplautācijas izmaksas', 'EUR/ha', 'Eksplautācijas izmaksu pozīcija')
  }
}



const $container = useTemplateRef('chartContainer');

const appendChart = (chartType: ChartType, options: any, totalCharts: number) => {
  const dataBase64 = renderChartJs(chartType as any,  props.width, props.height / totalCharts, options);
  const $image2 = document.createElement('img');
  $image2.src = dataBase64;
  const container = $container.value as HTMLElement;
  container.appendChild($image2);
}

onMounted(async () => {
  appendChart('bar', buildChartByOperatingCost(props.farmland), 3);
  appendChart('bar', buildChartCostDivision(props.farmland), 3);
  appendChart('bar', buildChartByOperations(props.farmland), 3);
})
</script>
<template>
  <div id="container">
    <div class="page" style="margin: 10px;">
      <div ref="chartContainer">
      </div>
    </div>
    <div class="page">
      <table class="gross-table">
        <tbody>
          <tr class="bottom">
            <td class="right" colspan="4">
              <b>Bruto seguma novērtējums, {{ props.farmland.displayName }},</b> aprēķina lietotnes versija - {{ AppVersionNumber }}
            </td>
            <td class="right" colspan="3">
              Aprēķina datums:
            </td>
            <td class="right">{{ dateToString(new Date()) }}</td>
          </tr>
          <tr class="bottom bolded">
            <td class="left">Ieņēmumi</td>
            <td class="center">Mērvienība</td>
            <td class="center">Daudzums</td>
            <td class="center">Cena, EUR</td>
            <td class="right" colspan="4">Kopā, EUR</td>
          </tr>
          <tr>
            <td class="left">{{ props.farmland.cropName }}</td>
            <td class="center">t</td>
            <td class="center">{{ DisplayNumber(props.farmland.totalProductTons) }}</td>
            <td class="center">{{ DisplayNumber(props.farmland.standardProductPrice) }}</td>
            <td class="right" colspan="4">{{ DisplayNumber(props.farmland.totalEarnings) }}</td>
          </tr>
          <tr class="shaded bolded">
            <td class="left" colspan="7">Ieņēmumi kopā (1)</td>
            <td class="right">{{ DisplayNumber(props.farmland.totalEarnings) }}</td>
          </tr>
          <tr>
            <td class="left bolded" colspan="8">Atbalsts</td>
          </tr>
          <tr v-for="supportType in (props.farmland.agriculturalSupportAdjustments)" v-bind:key="supportType.id">
            <td class="left">{{ supportType.displayName }}</td>
            <td class="center">ha</td>
            <td class="center">{{ DisplayNumber(props.farmland.landArea) }}</td>
            <td class="center">{{ DisplayNumber(supportType.value) }}</td>
            <td class="right" colspan="4">{{ DisplayNumber(props.farmland.totalAgriculturalSupportAdjustmentForType(supportType.adjustment_type_code)) }}</td>
          </tr>
          <tr class="shaded bolded">
            <td class="left" colspan="7">Atbalsts kopā (2)</td>
            <td class="right">{{ DisplayNumber(props.farmland.totalAgriculturalSupportAdjustments) }}</td>
          </tr>
          <tr>
            <td class="left" colspan="8">Mainīgās izmaksas</td>
          </tr>
          <tr>
            <td class="left bolded" colspan="8">Izejvielu izmaksas</td>
          </tr>
          <tr>
            <td class="left">Sēklas/stādi</td>
            <td class="center">t</td>
            <td class="center">{{ DisplayNumber(props.farmland.cropUsageTotalTons) }}</td>
            <td class="center">{{ DisplayNumber(props.farmland.cropCostsPerTon) }}</td>
            <td class="right" colspan="4">{{ DisplayNumber(props.farmland.totalCropCosts) }}</td>
          </tr>
          <tr v-for="otherCost in (props.farmland.otherAdjustmentCosts)" v-bind:key="otherCost.id">
            <td class="left">{{ otherCost.displayName }}</td>
            <td class="center">ha</td>
            <td class="center">{{ DisplayNumber(props.farmland.landArea) }}</td>
            <td class="center">{{ DisplayNumber(otherCost.costPerHectare) }}</td>
            <td class="right" colspan="4">{{ DisplayNumber(props.farmland.landArea * otherCost.costPerHectare) }}</td>
          </tr>
          <tr class="bottom shaded bolded">
            <td class="left" colspan="7">Izejvielu izmaksas kopā (3)</td>
            <td class="right">{{ DisplayNumber(props.farmland.materialCostsTotal) }}</td>
          </tr>
          <tr class="bottom bolded">
            <td class="col25 center">Ekspluatācijas izmaksas</td>
            <td class="col10 center">Amortizācija, EUR/ha</td>
            <td class="col10 center">Darbaspēka izmaksas, EUR/ha</td>
            <td class="col10 center">Remonta izmaksas, EUR/ha</td>
            <td class="col10 center">Degvielas izmaksas, EUR/ha</td>
            <td class="col10 center">Smērvielu izmaksas, EUR/ha</td>
            <td class="col10 center">Ekspluatācijas izmaksas, EUR/ha</td>
            <td class="col15 right">Ekspluatācijas izmaksas, EUR</td>
          </tr>
          <tr v-for="operation in (props.farmland.operations)" v-bind:key="operation.id">
            <td class="left">{{ operation.displayName }}, {{ operation.equipmentOrExternalServiceDisplayName }}</td>
            <td class="center">{{ DisplayNumber(operation.depreciationValue('ha')) }}</td>
            <td class="center">{{ DisplayNumber(operation.equipmentOperatorWageCosts('ha')) }}</td>
            <td class="center">{{ DisplayNumber(operation.accumulatedRepairCosts('ha')) }}</td>
            <td class="center">{{ DisplayNumber(operation.totalFuelCosts('ha')) }}</td>
            <td class="center">{{ DisplayNumber(operation.lubricationCosts('ha')) }}</td>
            <td class="center">{{ DisplayNumber(operation.totalOperatingCosts('ha')) }}</td>
            <td class="right">{{ DisplayNumber(operation.totalOperatingCosts('kopā')) }}</td>
          </tr>
          <tr class="top shaded">
            <td class="left bolded">Ekspluatācijas izmaksas kopā (4)</td>
            <td class="center">{{ DisplayNumber(sumBy(farmland.operations, (operation: OperationModel) => operation.depreciationValue('ha'))) }}</td>
            <td class="center">{{ DisplayNumber(sumBy(farmland.operations, (operation: OperationModel) => operation.equipmentOperatorWageCosts('ha'))) }}</td>
            <td class="center">{{ DisplayNumber(sumBy(farmland.operations, (operation: OperationModel) => operation.accumulatedRepairCosts('ha'))) }}</td>
            <td class="center">{{ DisplayNumber(sumBy(farmland.operations, (operation: OperationModel) => operation.totalFuelCosts('ha'))) }}</td>
            <td class="center">{{ DisplayNumber(sumBy(farmland.operations, (operation: OperationModel) => operation.lubricationCosts('ha'))) }}</td>
            <td class="center">{{ DisplayNumber(sumBy(farmland.operations, (operation: OperationModel) => operation.totalOperatingCosts('ha'))) }}</td>
            <td class="right bolded">{{ DisplayNumber(sumBy(farmland.operations, (operation: OperationModel) => operation.totalOperatingCosts('kopā'))) }}</td>
          </tr>
          <tr>
            <td class="left bolded" colspan="7">Izmaksas kopā (3 + 4)</td>
            <td class="right bolded">{{ DisplayNumber(props.farmland.grossCoverageTotalCosts) }}</td>
          </tr>
          <tr>
            <td class="left bolded" colspan="7">Bruto segums 1 (Ieņēmumi - Izejvielu izmaksas)</td>
            <td class="right bolded">{{ DisplayNumber(props.farmland.grossCoverageFirst) }}</td>
          </tr>
          <tr>
            <td class="left bolded" colspan="7">Bruto segums 2 (Ieņēmumi - Ekspluatācijas izmaksas)</td>
            <td class="right bolded">{{ DisplayNumber(props.farmland.grossCoverageSecond) }}</td>
          </tr>
          <tr class="shaded bolded">
            <td class="left" colspan="7">Bruto segums 3 ((Ieņēmumi + Atbalsts) - Ekspluatācijas izmaksas)</td>
            <td class="right">{{ DisplayNumber(props.farmland.grossCoverageThird) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>
<style scoped>
  @font-face {
    font-family: 'Noto Serif';
    src: url('https://fonts.gstatic.com/s/notoserif/v23/ga6iaw1J5X9T9RW6j9bNVls-hfgvz8JcMofYTa32J4wsL2JAlAhZqFCjwM0Lhq_Szw.ttf') format('truetype');
    font-weight: 400
  }

  @font-face {
    font-family: 'Noto Serif';
    src: url('https://fonts.gstatic.com/s/notoserif/v23/ga6iaw1J5X9T9RW6j9bNVls-hfgvz8JcMofYTa32J4wsL2JAlAhZT1ejwM0Lhq_Szw.ttf') format('truetype');
    font-weight: 700
  }

  * {
    font-family: 'Noto Serif';
    font-size: 16px;
  }
  .page {
    width: 100%;
    max-width: 1520px;
    min-width: 1520px;
    min-height: 1080px;
  }
  .gross-table {
    width: 100%;
    margin: 2rem;
  }
  .center {
    text-align: center;
  }
  .left {
    text-align: left;
  }
  .right {
    text-align: right;
  }
  .bottom, .bottom td {
    border-bottom: 1px solid #000;
  }
  .top, .top td {
    border-top: 1px solid #000;
  }
  .col25 {
    width: 25%;
  }
  .col10 {
    width: 10%;
  }
  .col15 {
    width: 15%;
  }
  .bolded, .bolded td {
    font-weight: bold;
  }
  .shaded, .shaded td {
    background-color: #e1e1e1;
  }
</style>
