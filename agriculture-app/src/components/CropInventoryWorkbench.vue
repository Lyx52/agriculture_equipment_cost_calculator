<script setup lang="ts">
import {
  BTableSimple,
  BTh,
  BTd,
  BTr,
  BThead,
  BTbody,
  BSpinner,
  BButton,
  useModalController,
  BTfoot,
  BFormInput
} from 'bootstrap-vue-next'
import { onBeforeMount } from 'vue'
  import { useCropsStore } from '@/stores/crops.ts'
  import BNumericFormInput from '@/components/elements/BNumericFormInput.vue'
  import type { CropTypeModel } from '@/stores/model/cropTypeModel.ts'
  import {v4 as uuid} from 'uuid';
  import TrashIcon from '@/components/icons/TrashIcon.vue'
  const cropsStore = useCropsStore();
  const {confirm} = useModalController();

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
  const onAddCropType = async () => {
    const id = uuid();
    await cropsStore.addCropTypeAsync({
      id: id,
      code: `custom_${id}`,
      name: 'Jauns kūltūraugs',
      lad_code: undefined,
      standard_yield: 1,
      standard_product_price: 100,
      standard_seed_cost: 0.25,
      standard_field_usage: 1,
      is_custom: true
    });
  }

  // Load all codifier definitions
  onBeforeMount(async () => {
    await cropsStore.fetchByFilters();
  })
</script>

<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row mb-3">
      <h5 class="card-title">Kūltūraugu izmaksas</h5>
      <BButton variant="danger" class="ms-auto" @click="onClearCropSettings">Attiestatīt uz sākuma vērtībām</BButton>
    </div>

    <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
      <BThead head-variant="dark" class="position-sticky top-0 in-front">
        <BTr>
          <BTh>Klasifikatora kods</BTh>
          <BTh>Kūltūrauga nosaukums</BTh>
          <BTh>Standartražība, t/ha</BTh>
          <BTh>Produkcijas cena, EUR/t</BTh>
          <BTh>Sēklas cena, EUR/kg</BTh>
          <BTh>Izsējas norma, kg/ha</BTh>
          <BTh>&nbsp;</BTh>
        </BTr>
      </BThead>
      <BTbody v-if="cropsStore.isLoading">
        <BTr>
          <BTd colspan="7" class="text-center">
            <BSpinner v-if="true" />
          </BTd>
        </BTr>
      </BTbody>
      <BTbody v-else>
        <BTr v-for="row in cropsStore.items" v-bind:key="row.id">
          <BTd v-if="row.isCustom">
            &nbsp;-&nbsp;
          </BTd>
          <BTd v-else>
            {{ row.ladCode }}
          </BTd>

          <BTd v-if="row.isCustom">
            <BFormInput @change="() => onValuesChanged(row)" v-model="row.name" />
          </BTd>
          <BTd v-else>
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
          <BTd>
            <BNumericFormInput @changed="() => onValuesChanged(row)" v-model="row.standard_field_usage" />
          </BTd>
          <BTd v-if="row.isCustom">
            <BButton class="ms-auto flex-grow-0 btn-icon" variant="danger" size="sm" @click="cropsStore.removeCropAsync(row.id!)">
              <TrashIcon />
            </BButton>
          </BTd>
          <BTd v-else>
            &nbsp;
          </BTd>
        </BTr>

      </BTbody>
      <BTfoot class="position-sticky bottom-0 in-front">
        <BTr>
          <BTd colspan="7">
            <BButton variant="success" size="sm" @click="onAddCropType">Pievienot</BButton>
          </BTd>
        </BTr>
      </BTfoot>
    </BTableSimple>
  </div>
</template>

<style scoped>
  .btn-group {
    margin-top: 0.1rem !important;
  }
  .table-height {
    max-height: 50vh;
    min-height: 50vh;
  }
  .in-front {
    z-index: 999;
  }
</style>
