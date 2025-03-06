
<script setup lang="ts">

  import { useOperationStore } from '@/stores/operation.ts'
  import {
    BTableSimple,
    BThead,
    BTr,
    BTh,
    BTbody,
    BTd,
    BFormGroup,
    BButton,
    BButtonGroup,
    BTfoot,
    BBadge, useModalController, BSpinner
  } from 'bootstrap-vue-next'
  import {v4 as uuid} from 'uuid';
  import { useFarmlandStore } from '@/stores/farmland.ts'
  import CodifierDropdown from '@/components/elements/CodifierDropdown.vue'
  import { Codifiers } from '@/stores/enums/Codifiers.ts'
  import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
  import { useCodifierStore } from '@/stores/codifier.ts'
  import type { ICodifier } from '@/stores/interface/ICodifier.ts'
  import type { IOperation } from '@/stores/interface/IOperation.ts'
  import TrashIcon from '@/components/icons/TrashIcon.vue'
  import SimpleDropdown from '@/components/elements/SimpleDropdown.vue'
  import IconX from '@/components/icons/IconX.vue'
  import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
  import { onMounted } from 'vue'
  import type { IOperationWorkbenchProps } from '@/props/IOperationWorkbenchProps.ts'
  import { InfoModalText, type InfoModalTextType } from '@/constants/InfoModalText.ts'
  import { useAdjustmentsStore } from '@/stores/adjustments.ts'
  import { DisplayNumber } from '../utils.ts'
  const props = defineProps<IOperationWorkbenchProps>();
  const operationStore = useOperationStore();
  const farmlandStore = useFarmlandStore();
  const farmlandOperationStoreId = uuid();
  const farmlandOperationCodifierStore = useCodifierStore(farmlandOperationStoreId);
  const equipmentCollectionStore = useEquipmentCollectionStore();
  const adjustmentStore = useAdjustmentsStore();
  const {show} = useModalController();

  const addNewOperation = async () => {
    await operationStore.addOperationAsync({
      id: '',
      user_farmland_id: operationStore.filteredFarmlandId,
      operation_code: 'operation_110',
      tractor_or_combine_id: undefined,
      machine_id: undefined,
      employee_id: undefined
    });
    operationStore.filteredFarmlandOperationCode = undefined;
    farmlandOperationCodifierStore.$reset();
  }

  const onOperationFiltered = (item: ICodifier) => {
    operationStore.filteredFarmlandOperationCode = item.code
  }

  const hasFilters = () => {
    return !!operationStore.filteredFarmlandOperationCode || !!operationStore.filteredFarmlandId
  }

  const resetFilters = () => {
    farmlandOperationCodifierStore.$reset();
    operationStore.filteredFarmlandId = undefined;
    operationStore.filteredFarmlandOperationCode = undefined;
  }

  const onOperationSelected = async (operation: IOperation, codifier: ICodifier) => {
    await operationStore.updateOperationAsync({
      ...operation,
      operation_code: codifier.code,
    })
    farmlandOperationCodifierStore.$reset();
    operationStore.filteredFarmlandOperationCode = undefined;
  }

  // Load all codifier definitions
  onMounted(async () => {
    await equipmentCollectionStore.fetchByFilters();
    await farmlandStore.fetchByFilters();
    await operationStore.fetchByFilters();
    await adjustmentStore.fetchByFilters();
  });
  const showInfoModal = (infoText: InfoModalTextType) => {

    show?.({
      props: {
        body: InfoModalText[infoText],
        noFooter: true
      }
    });
  }
</script>

<template>
  <div class="d-flex flex-column h-100">
    <h4 class="card-title" v-if="props.isModal">Lauks <u>{{ operationStore.filteredFarmland?.displayName }}</u></h4>
    <h4 class="card-title mb-3" v-else>Apstrādes operācijas visiem laukiem</h4>
    <div class="d-flex flex-row gap-3" v-if="!props.isModal">
      <BFormGroup label="Filtrēt pēc lauka">
        <SimpleDropdown
          :is-loading="false"
          :get-filtered="farmlandStore.getFiltered"
          :get-formatted-option="farmlandStore.getFormattedOption"
          v-model="operationStore.filteredFarmlandId"
        />
      </BFormGroup>
      <BFormGroup label="Filtrēt pēc apstrādes operācijas">
        <CodifierDropdown
          :is-valid="true"
          :parent-codifier-codes="[Codifiers.OperationTypes]"
          @on-selected="onOperationFiltered"
          :store-id="farmlandOperationStoreId"
        />
      </BFormGroup>
      <BButton variant="danger" class="mt-auto ms-auto" v-if="hasFilters()" @click="resetFilters()">
        Atiestatīt filtrus <IconX/>
      </BButton>
    </div>
    <BTableSimple hover no-border-collapse outlined responsive caption-top class="mt-4 w-100 mb-0 overflow-y-auto common-table-style">
      <BThead class="position-sticky top-0 bg-primary in-front" >
        <BTr>
          <BTh v-if="!props.isModal">Lauks</BTh>
          <BTh>Apstrādes operācija</BTh>
          <BTh>Darbinieks</BTh>
          <BTh>Tehnikas vienība</BTh>
          <BTh>Degvielas izmaksas, EUR/ha</BTh>
          <BTh>Smērvielu izmaksas, EUR/ha</BTh>
          <BTh>Remonta izmaksas, EUR/ha</BTh>
          <BTh>Darbaspēka izmaksas, EUR/h</BTh>
          <BTh>Kopējās mainīgās izmaksas, EUR/ha</BTh>
          <BTh>&nbsp;</BTh>
        </BTr>
      </BThead>
      <BTbody v-if="operationStore.isLoading">
        <BTr>
          <BTd colspan="11" class="text-center">
            <BSpinner v-if="true" />
          </BTd>
        </BTr>
      </BTbody>
      <BTbody v-else>
        <BTr v-for="row in operationStore.filteredItems" v-bind:key="row.id">
          <BTd v-if="!props.isModal">
            <SimpleDropdown
              :is-loading="false"
              :get-filtered="farmlandStore.getFiltered"
              :get-formatted-option="farmlandStore.getFormattedOption"
              v-model="row.user_farmland_id"
              @changed="operationStore.updateOperationAsync(row)"
            />
          </BTd>
          <BTd>
            <CodifierDropdown
              :is-valid="true"
              :parent-codifier-codes="[Codifiers.OperationTypes]"
              :store-id="row.id"
              @on-selected="codifier => onOperationSelected(row, codifier)"
              :showValue="true"
            />
          </BTd>
          <BTd>
            <SimpleDropdown
              :is-loading="false"
              :get-filtered="adjustmentStore.getFilteredEmployees"
              :get-formatted-option="adjustmentStore.getFormattedOption"
              v-model="row.employee_id"
              @changed="operationStore.updateOperationAsync(row)"
            />
          </BTd>
          <BTd>
            <div class="d-flex flex-row gap-3">
              <SimpleDropdown
                :is-loading="false"
                :get-filtered="equipmentCollectionStore.getFilteredTractorOrSelfPropelledOrCombine"
                :get-formatted-option="equipmentCollectionStore.getFormattedOptionShort"
                v-model="row.tractor_or_combine_id"
                @changed="operationStore.updateOperationAsync(row)"
              />
              <SimpleDropdown
                :is-loading="false"
                :is-invalid="row.machineValid"
                :get-filtered="equipmentCollectionStore.getFilteredMachines"
                :get-formatted-option="equipmentCollectionStore.getFormattedOptionShort"
                v-model="row.machine_id"
                v-if="row.tractorOrCombine?.isTractor"
                @changed="operationStore.updateOperationAsync(row)"
              />
            </div>
          </BTd>
          <BTd class="text-center align-middle">
            <div class="d-flex gap-1 justify-content-center align-items-center">{{ DisplayNumber(row.totalFuelCosts('ha')) }} <BBadge class="cursor-pointer" @click="() => showInfoModal('fuel_usage_info')">slodze <br/> {{ (row.loadFactorOnPowerMachine * 100).toFixed(2) }}%</BBadge></div>
          </BTd>
          <BTd class="text-center align-middle">
            {{ DisplayNumber(row.lubricationCosts('ha')) }}
          </BTd>
          <BTd class="text-center align-middle">
            {{ DisplayNumber(row.accumulatedRepairCosts('ha')) }}
          </BTd>
          <BTd class="text-center align-middle">
            {{ DisplayNumber(row.equipmentOperatorWageCosts('kopā')) }}
          </BTd>
          <BTd class="text-center align-middle">
            {{ DisplayNumber(row.totalOperatingCosts('ha')) }}
          </BTd>
          <BTd class="text-end align-middle">
            <BButtonGroup class="d-inline-flex flex-row btn-group">
              <BButton class="ms-auto flex-grow-0 btn-icon" variant="danger" size="sm" @click="operationStore.removeOperationAsync(row)">
                Dzēst <TrashIcon />
              </BButton>
            </BButtonGroup>
          </BTd>
        </BTr>
      </BTbody>
      <BTfoot class="position-sticky bottom-0 in-front">
        <BTr v-if="props.isModal">
          <BTd colspan="11">
            <BButton variant="success" size="sm" @click="addNewOperation">Pievienot</BButton>
          </BTd>
        </BTr>
      </BTfoot>
    </BTableSimple>
  </div>
</template>

<style>
  .in-front {
    z-index: 999;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
