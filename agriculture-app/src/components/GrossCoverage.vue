<script setup lang="ts">
import {BButton, BFormSelect, BInputGroup, BTableSimple, BTbody, BTd, BTh, BThead, BTr} from 'bootstrap-vue-next'
import { useFarmlandStore } from '@/stores/farmland.ts'
import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'
import { computed, ref } from 'vue'
import SumTd from '@/components/table/SumTd.vue'
import IconArrowDownRightSquare from '@/components/icons/IconArrowDownRightSquare.vue'
import IconClose from '@/components/icons/IconClose.vue'
import { DisplayNumber } from '../utils.ts'
import IconSpreadsheet from '@/components/icons/IconSpreadsheet.vue'
import IconPDF from '@/components/icons/IconPDF.vue'
import { buildXlsxReport } from '@/exports/xlsx.ts'
import { buildPdfReport } from '@/exports/pdf.ts'
import {useFarmInformationStore} from "@/stores/farmInformation.ts";
const farmlandStore = useFarmlandStore();
const farmlandInfoStore = useFarmInformationStore();
const selectedFarmland = ref<FarmlandModel|undefined>(undefined);
const hasSelectedFilter = computed(() => !!selectedFarmland.value);
const isBuildingPdf = ref(false);
const downloadAsXlsx = () => {
  if (!selectedFarmland.value) {
    return;
  }
  buildXlsxReport(selectedFarmland.value!);
}

const downloadAsPDF = async () => {
  if (!selectedFarmland.value) {
    return;
  }
  isBuildingPdf.value = true;
  buildPdfReport(selectedFarmland.value!)
    .finally(() => { isBuildingPdf.value = false; });
}

</script>

<template>
  <div class="container-fluid">
    <div class="row" v-if="hasSelectedFilter">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh colspan="1">
              <BButton @click="() => selectedFarmland = undefined" variant="outline-danger" class="cursor-pointer btn-icon">
                Aizvērt <IconClose />
              </BButton>
              <BButton @click="downloadAsXlsx" variant="outline-success" class="cursor-pointer ms-2 btn-icon">
                Lejupielādēt <IconSpreadsheet />
              </BButton>
              <BButton :loading="isBuildingPdf" @click="downloadAsPDF" variant="outline-danger" class="cursor-pointer ms-2 btn-icon">
                Lejupielādēt <IconPDF />
              </BButton>
            </BTh>
            <BTh colspan="5">
              <h5 class="text-end fw-bold text-black">Bruto seguma novērtējums, <span class="text-decoration-underline">{{ selectedFarmland?.displayName }}</span></h5>
            </BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr>
            <BTh>Ieņēmumi</BTh>
            <BTh>Mērvienība</BTh>
            <BTh>Daudzums</BTh>
            <BTh>Cena, EUR</BTh>
            <BTh>Kopā, EUR</BTh>
          </BTr>
          <BTr>
            <BTd>
              &ensp;&ensp;&ensp;{{ selectedFarmland?.cropName }}
            </BTd>
            <BTd>t</BTd>
            <BTd>{{ DisplayNumber(selectedFarmland?.totalProductTons) }}</BTd>
            <BTd>{{ DisplayNumber(selectedFarmland?.standardProductPrice) }}</BTd>
            <BTd>{{ DisplayNumber(selectedFarmland?.totalEarnings) }}</BTd>
          </BTr>
          <BTr>
            <BTd>
              &ensp;&ensp;&ensp;<b>Ieņēmumi kopā</b> (1)
            </BTd>
            <BTd>&nbsp;</BTd>
            <BTd>&nbsp;</BTd>
            <BTd>&nbsp;</BTd>
            <BTh>{{ DisplayNumber(selectedFarmland?.totalEarnings) }}</BTh>
          </BTr>
          <BTr v-if="(selectedFarmland?.agriculturalSupportAdjustments ?? []).length > 0">
            <BTh>Atbalsts</BTh>
            <BTh>&nbsp;</BTh>
            <BTh>&nbsp;</BTh>
            <BTh>&nbsp;</BTh>
            <BTh>&nbsp;</BTh>
          </BTr>
          <BTr v-for="supportType in (selectedFarmland?.agriculturalSupportAdjustments ?? [])" v-bind:key="supportType.id">
            <BTd class="text-start align-middle whitespace-nowrap">
              &ensp;&ensp;&ensp;{{ supportType.displayName }}
            </BTd>
            <BTd>ha</BTd>
            <BTd>{{ DisplayNumber(selectedFarmland?.landArea) }}</BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(supportType.value) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(selectedFarmland?.totalAgriculturalSupportAdjustmentForType(supportType.adjustment_type_code)) }}
            </BTd>
          </BTr>
          <BTr v-if="(selectedFarmland?.agriculturalSupportAdjustments ?? []).length > 0">
            <BTd>
              &ensp;&ensp;&ensp;<b>Atbalsts kopā</b> (2)
            </BTd>
            <BTd>&nbsp;</BTd>
            <BTd>&nbsp;</BTd>
            <BTd>&nbsp;</BTd>
            <BTh>{{ DisplayNumber(selectedFarmland?.totalAgriculturalSupportAdjustments) }}</BTh>
          </BTr>
          <BTr>
            <BTh class="text-start" colspan="6">
              Mainīgās izmaksas
            </BTh>
          </BTr>
          <BTr>
            <BTh class="text-start" colspan="6">
              &ensp;&ensp;&ensp;Izejvielu izmaksas
            </BTh>
          </BTr>
          <BTr>
            <BTd>
              &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;Sēklas/stādi
            </BTd>
            <BTd>t</BTd>
            <BTd>{{ DisplayNumber(selectedFarmland?.cropUsageTotalTons) }}</BTd>
            <BTd>{{ DisplayNumber(selectedFarmland?.cropCostsPerTon) }}</BTd>
            <BTd>{{ DisplayNumber(selectedFarmland?.totalCropCosts) }}</BTd>
          </BTr>
          <BTr v-for="otherCost in (selectedFarmland?.otherAdjustmentCosts ?? [])" v-bind:key="otherCost.id">
            <BTd>
              &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{{ otherCost.displayName }}
            </BTd>
            <BTd>ha</BTd>
            <BTd>{{ DisplayNumber(selectedFarmland?.landArea) }}</BTd>
            <BTd>{{ DisplayNumber(otherCost.costPerHectare) }}</BTd>
            <BTd>{{ DisplayNumber(selectedFarmland?.totalOtherAdjustmentCosts) }}</BTd>
          </BTr>
          <BTr>
            <BTd>
              &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<b>Izejvielu izmaksas kopā</b> (3)
            </BTd>
            <BTd>&nbsp;</BTd>
            <BTd>&nbsp;</BTd>
            <BTd>&nbsp;</BTd>
            <BTh>{{ DisplayNumber(selectedFarmland?.materialCostsTotal) }}</BTh>
          </BTr>
          <BTr>
            <BTh class="text-start">
              &ensp;&ensp;&ensp;Eksplautācijas izmaksas (4.1)
            </BTh>
            <BTh class="text-start whitespace-nowrap">Amortizācija, EUR/ha</BTh>
            <BTh class="text-start whitespace-nowrap">Darbaspēka izmaksas, EUR/ha</BTh>
            <BTh class="text-start whitespace-nowrap">Remonta izmaksas, EUR/ha</BTh>
            <BTh class="text-start whitespace-nowrap">&nbsp;</BTh>
          </BTr>
          <BTr v-for="operation in (selectedFarmland?.operations ?? [])" v-bind:key="operation.id">
            <BTd class="text-start align-middle whitespace-nowrap">
              &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{{ operation.displayName }}, {{ operation.equipmentOrExternalServiceDisplayName }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(operation.depreciationValue('ha')) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(operation.equipmentOperatorWageCosts('ha')) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(operation.accumulatedRepairCosts('ha')) }}
            </BTd>
            <BTd class="text-start align-middle">
              &nbsp;
            </BTd>
          </BTr>
          <BTr>
            <BTh class="text-start">
              &ensp;&ensp;&ensp;Eksplautācijas izmaksas (4.2)
            </BTh>
            <BTh class="text-start whitespace-nowrap">Degvielas izmaksas, EUR/ha</BTh>
            <BTh class="text-start whitespace-nowrap">Smērvielu izmaksas, EUR/ha</BTh>
            <BTh class="text-start whitespace-nowrap">Eksplautācijas izmaksas, EUR/ha</BTh>
            <BTh class="text-start whitespace-nowrap">&nbsp;</BTh>
          </BTr>
          <BTr v-for="operation in (selectedFarmland?.operations ?? [])" v-bind:key="operation.id">
            <BTd class="text-start align-middle whitespace-nowrap">
              &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{{ operation.displayName }}, {{ operation.equipmentOrExternalServiceDisplayName }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(operation.totalFuelCosts('ha')) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(operation.lubricationCosts('ha')) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(operation.totalOperatingCosts('ha')) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(operation.totalOperatingCosts('kopā')) }}
            </BTd>
          </BTr>
          <BTr>
            <BTd>
              &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<b>Eksplautācijas izmaksas kopā</b> (4)
            </BTd>
            <BTd>&nbsp;</BTd>
            <BTd>&nbsp;</BTd>
            <BTd>&nbsp;</BTd>
            <BTh>{{ DisplayNumber(selectedFarmland?.totalOperatingCosts) }}</BTh>
          </BTr>
          <BTr>
            <BTd>
              <b>Izmaksas kopā</b> (3 + 4)
            </BTd>
            <BTd>&nbsp;</BTd>
            <BTd>&nbsp;</BTd>
            <BTd>&nbsp;</BTd>
            <BTh>{{ DisplayNumber(selectedFarmland?.grossCoverageTotalCosts) }}</BTh>
          </BTr>
          <BTr>
            <BTh colspan="4" class="text-start">
              Bruto segums 1 (Ieņēmumi - Izejvielu izmaksas)
            </BTh>
            <BTh class="text-start whitespace-nowrap">
              {{ DisplayNumber(selectedFarmland?.grossCoverageFirst) }}
            </BTh>
          </BTr>
          <BTr>
            <BTh colspan="4" class="text-start">
              Bruto segums 2 (Ieņēmumi - Eksplautācijas izmaksas)
            </BTh>
            <BTh class="text-start whitespace-nowrap">
              {{ DisplayNumber(selectedFarmland?.grossCoverageSecond) }}
            </BTh>
          </BTr>
          <BTr>
            <BTh colspan="4" class="text-start">
              Bruto segums 3 ((Ieņēmumi + Atbalsts) - Eksplautācijas izmaksas)
            </BTh>
            <BTh class="text-start whitespace-nowrap">
              {{ DisplayNumber(selectedFarmland?.grossCoverageThird) }}
            </BTh>
          </BTr>
        </BTbody>
      </BTableSimple>
    </div>
    <div class="row" v-else>
      <div class="col d-flex flex-row gap-2">
        <BInputGroup prepend="Filtrēt pēc gada" class="w-fit-content">
          <BFormSelect :options="farmlandInfoStore.farmlandYearOptions" v-model="farmlandStore.yearFilter" />
        </BInputGroup>
      </div>
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh colspan="8">
              <h5 class="text-center fw-bold text-black">Bruto seguma novērtējums</h5>
            </BTh>
          </BTr>
          <BTr>
            <BTh>&nbsp;</BTh>
            <BTh>Apstrādes lauks</BTh>
            <BTh>Lauka platība, ha</BTh>
            <BTh>Ieņēmumi, EUR/ha</BTh>
            <BTh>Atbalsts, EUR/ha</BTh>
            <BTh>Izejvielu izmaksas, EUR/ha</BTh>
            <BTh>Mainīgās izmaksas, EUR/ha</BTh>
            <BTh>Bruto segums, EUR/ha</BTh>
            <BTh>Bruto segums, EUR</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in farmlandStore.filteredItems" v-bind:key="row.id">
            <BTd>
              <BButton @click="() => selectedFarmland = row"  variant="outline-secondary" class="cursor-pointer btn-row">
                Detalizēti <IconArrowDownRightSquare />
              </BButton>
            </BTd>
            <BTd class="text-start align-middle">
              {{ row.displayName }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(row.landArea) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(row.earningsPerHectare) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(row.totalAgriculturalSupportAdjustmentsPerHectare) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(row.materialCostsPerHectare) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(row.totalOperatingCostsPerHectare) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(row.grossCoveragePerHectare) }}
            </BTd>
            <BTd class="text-start align-middle">
              {{ DisplayNumber(row.grossCoverage) }}
            </BTd>
          </BTr>
          <BTr class="fw-bold">
            <BTd class="text-end user-select-none vertical-align-middle" colspan="2">Kopā</BTd>
            <SumTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.landArea" />
            <SumTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.earningsPerHectare" />
            <SumTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.totalAgriculturalSupportAdjustmentsPerHectare" />
            <SumTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.materialCostsPerHectare" />
            <SumTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.totalOperatingCostsPerHectare" />
            <SumTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.grossCoveragePerHectare" />
            <SumTd class="fw-bold" :items="farmlandStore.filteredItems" :get-prop="(item: FarmlandModel) => item.grossCoverage" />
          </BTr>
        </BTbody>
      </BTableSimple>
    </div>
  </div>

</template>

<style scoped>
.table-height {
  max-height: 40vh;
  min-height: 25vh;
}
.in-front {
  z-index: 999;
}
.cursor-pointer {
  cursor: pointer;
}
.vertical-align-middle {
  vertical-align: middle !important;
}
.w-fit-content {
  width: fit-content;
}
.btn-row {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}
.whitespace-nowrap {
  white-space: nowrap !important;
}
</style>
