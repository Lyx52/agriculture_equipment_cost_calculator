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
    BTfoot,
    BFormInput
  } from 'bootstrap-vue-next'
  import BNumericFormInput from '@/components/elements/BNumericFormInput.vue'
  import {v4 as uuid} from 'uuid';
  import TrashIcon from '@/components/icons/TrashIcon.vue'
  import { useAdjustmentsStore } from '@/stores/adjustments.ts'
  import { Codifiers } from '@/stores/enums/Codifiers.ts'
  import { useFarmlandStore } from '@/stores/farmland.ts'
  import SimpleDropdown from '@/components/elements/SimpleDropdown.vue'
  import type { IAdjustment } from '@/stores/interface/IAdjustment.ts'
  const adjustmentStore = useAdjustmentsStore();
  const farmlandStore = useFarmlandStore();

  const addMaterialAdjustment = async () => {
    await adjustmentStore.addAdjustmentAsync({
      id: uuid(),
      adjustment_type_code: Codifiers.CustomAdjustmentsMaterials,
      value: 0,
      name: 'Papildus izejvielu izmaksas',
      user_farmland_id: undefined
    } as IAdjustment);
  }
</script>

<template>
  <div class="d-flex flex-column mb-3">
    <div class="d-flex flex-row">
      <h5 class="card-title">Papildus izejvielu izmaksas</h5>
    </div>

    <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
      <BThead head-variant="dark" class="position-sticky top-0 in-front">
        <BTr>
          <BTh>Nosaukums</BTh>
          <BTh>Lauks</BTh>
          <BTh>Papildus izmaksas, EUR/ha</BTh>
          <BTh>&nbsp;</BTh>
        </BTr>
      </BThead>
      <BTbody v-if="adjustmentStore.isLoading">
        <BTr>
          <BTd colspan="7" class="text-center">
            <BSpinner v-if="true" />
          </BTd>
        </BTr>
      </BTbody>
      <BTbody v-else>
        <BTr v-for="row in adjustmentStore.customMaterialAdjustments" v-bind:key="row.id">
          <BTd>
            <BFormInput v-model="row.name" @change="() => adjustmentStore.updateAdjustmentAsync(row)" />
          </BTd>
          <BTd>
            <SimpleDropdown
              v-if="!farmlandStore.isLoading"
              :is-loading="farmlandStore.isLoading"
              :get-filtered="farmlandStore.getFiltered"
              :get-formatted-option="farmlandStore.getFormattedOption"
              v-model="row.user_farmland_id"
              @changed="adjustmentStore.updateAdjustmentAsync(row)"
            />
          </BTd>
          <BTd>
            <BNumericFormInput @changed="() => adjustmentStore.updateAdjustmentAsync(row)" v-model="row.value" />
          </BTd>
          <BTd>
            <BButton class="ms-auto btn-icon" variant="danger" size="sm" @click="adjustmentStore.removeAdjustmentAsync(row.id!)">
              <TrashIcon />
            </BButton>
          </BTd>
        </BTr>

      </BTbody>
      <BTfoot class="position-sticky bottom-0 in-front">
        <BTr>
          <BTd colspan="7">
            <BButton variant="success" size="sm" @click="addMaterialAdjustment">Pievienot</BButton>
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
    max-height: 33vh;
    min-height: 20vh;
  }
  .in-front {
    z-index: 999;
  }
</style>
