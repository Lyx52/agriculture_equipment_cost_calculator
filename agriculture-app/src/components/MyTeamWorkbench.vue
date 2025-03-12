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
  import type { IAdjustment } from '@/stores/interface/IAdjustment.ts'
  const adjustmentStore = useAdjustmentsStore();

  const addEmployee = async () => {
    await adjustmentStore.addAdjustmentAsync({
      id: uuid(),
      adjustment_type_code: Codifiers.EmployeeWagePerHour,
      value: 15,
      name: 'Darbinieks',
      user_farmland_id: undefined
    } as IAdjustment);
  }
</script>

<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row">
      <h5 class="card-title">Saimniecības darbinieki</h5>
    </div>
    <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
      <BThead head-variant="dark" class="position-sticky top-0 in-front">
        <BTr>
          <BTh>Nosaukums (Piemēram vārds, uzvārds)</BTh>
          <BTh>Darba alga EUR/h</BTh>
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
        <BTr v-for="row in adjustmentStore.employees" v-bind:key="row.id">
          <BTd class="text-center align-middle">
            <BFormInput v-model="row.name" @change="() => adjustmentStore.updateAdjustmentAsync(row)" />
          </BTd>
          <BTd class="text-center align-middle">
            <BNumericFormInput @changed="() => adjustmentStore.updateAdjustmentAsync(row)" v-model="row.value" />
          </BTd>
          <BTd class="text-end align-middle">
            <BButton class="ms-auto btn-icon" variant="danger" size="sm" @click="adjustmentStore.removeAdjustmentAsync(row.id!)">
              Dzēst <TrashIcon />
            </BButton>
          </BTd>
        </BTr>

      </BTbody>
      <BTfoot class="position-sticky bottom-0 in-front">
        <BTr>
          <BTd colspan="7">
            <BButton variant="success" size="sm" @click="addEmployee">Pievienot darbinieku</BButton>
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
