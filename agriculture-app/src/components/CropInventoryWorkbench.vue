<script setup lang="ts">
import {
  BTableSimple,
  BTh,
  BTd,
  BTr,
  BThead,
  BTbody,
  BSpinner, BButton, useModalController
} from 'bootstrap-vue-next'
  import { onMounted } from 'vue'
  import { useCropsStore } from '@/stores/crops.ts'
  import BNumericFormInput from '@/components/elements/BNumericFormInput.vue'
  import type { CropTypeModel } from '@/stores/model/cropTypeModel.ts'
  const cropsStore = useCropsStore();
  const {confirm} = useModalController();

  // Load all codifier definitions
  onMounted(async () => {
    await cropsStore.fetchByFilters();
  })
  const onValuesChanged = async (row: CropTypeModel) => {
    if (row.id) {
      await cropsStore.updateCropTypeAsync(row);
    } else {
      await cropsStore.addCropTypeAsync(row);
    }
  }
  const onClearCropSettings = async () => {
    const confirmed = await confirm?.({
      props: {
        title: 'Vai tiešām attiestatīt kūltūraugu datus?',
        cancelTitle: 'Atcelt',
        okTitle: 'Attiestatīt',
        okVariant: 'danger',
      }
    });
    if (confirmed) {
      await cropsStore.resetCropTypesAsync();
    }

  }
</script>

<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row">
      <h5 class="card-title">Kūltūraugu izmaksas</h5>
      <BButton variant="danger" class="ms-auto" @click="onClearCropSettings">Attiestatīt uz sākuma vērtībām</BButton>
    </div>

    <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
      <BThead head-variant="dark" class="position-sticky top-0 in-front">
        <BTr>
          <BTh>Klasifikatora kods</BTh>
          <BTh>Kūltūrauga nosaukums</BTh>
          <BTh>Standartražība, t/ha</BTh>
          <BTh>Produkcijas cena, EUR/t</BTh>
          <BTh>Sēklas cena, EUR/kg</BTh>
        </BTr>
      </BThead>
      <BTbody v-if="cropsStore.isLoading">
        <BTr>
          <BTd colspan="5" class="text-center">
            <BSpinner v-if="true" />
          </BTd>
        </BTr>
      </BTbody>
      <BTbody v-else>
        <BTr v-for="row in cropsStore.items" v-bind:key="row.id">
          <BTd>
            {{ row.ladCode }}
          </BTd>
          <BTd>
            {{ row.cropName }}
          </BTd>
          <BTd>
            <BNumericFormInput @changed="() => onValuesChanged(row)" v-model="row.standard_yield" />
          </BTd>
          <BTd>
            <BNumericFormInput @changed="() => onValuesChanged(row)" v-model="row.standard_product_price" />
          </BTd>
          <BTd>
            <BNumericFormInput @changed="() => onValuesChanged(row)" v-model="row.standard_seed_cost" />
          </BTd>
        </BTr>

      </BTbody>
    </BTableSimple>
  </div>
</template>

<style scoped>
  .btn-group {
    margin-top: 0.1rem !important;
  }
  .table-height {
    max-height: 85vh;
    min-height: 50vh;
  }
  .in-front {
    z-index: 999;
  }
</style>
