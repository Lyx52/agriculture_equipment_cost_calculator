<script setup lang="ts">
import { BTableSimple, BTbody, BTd, BTh, BThead, BTr, BFormSelect, BInputGroup } from 'bootstrap-vue-next'
import { sumBy } from '@/utils.ts'
import { ref } from 'vue'
import { useFarmlandStore } from '@/stores/farmland.ts'
const farmlandStore = useFarmlandStore();
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
        <caption>
          <h5 class="text-center fw-bold text-black">Patstāvīgo izmaksu novērtējums</h5>
        </caption>
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh>Apstrādes lauks</BTh>
            <BTh>Lauka platība, ha</BTh>
            <BTh>Ieņēmumi, EUR/ha</BTh>
            <BTh>Patstāvīgās izmaksas, EUR/ha</BTh>
            <BTh>Mainīgās izmaksas, EUR/ha</BTh>
            <BTh>Bruto segums, EUR/ha</BTh>
            <BTh>Bruto segums, EUR</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in farmlandStore.items" v-bind:key="row.id">
            <BTd>
              {{ `${row?.product_name ?? 'Lauks'} (${(row?.area ?? 0).toFixed(2)} ha)` }}
            </BTd>
            <BTd>
              {{ row.landArea.toFixed(2) }}
            </BTd>
            <BTd>
              {{ row.earningsPerHectare.toFixed(2) }}
            </BTd>
            <BTd>
              {{ row.totalOwnershipCostsPerHectare.toFixed(2) }}
            </BTd>
            <BTd>
              {{ row.totalOperatingCostsPerHectare.toFixed(2) }}
            </BTd>
            <BTd>
              {{ row.grossCoveragePerHectare.toFixed(2) }}
            </BTd>
            <BTd>
              {{ row.grossCoverage.toFixed(2) }}
            </BTd>
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
</style>
