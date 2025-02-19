
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
  const props = defineProps<IOperationWorkbenchProps>();
  const operationStore = useOperationStore();
  const farmlandStore = useFarmlandStore();
  const farmlandOperationStoreId = uuid();
  const farmlandOperationCodifierStore = useCodifierStore(farmlandOperationStoreId);
  const equipmentCollectionStore = useEquipmentCollectionStore();

  const {show} = useModalController();

  const addNewOperation = async () => {
    await operationStore.addOperationAsync({
      id: '',
      user_farmland_id: operationStore.filteredFarmlandId,
      operation_code: 'operation_110',
      tractor_or_combine_id: undefined,
      machine_id: undefined
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
  })
  const isTractor = (code: string|undefined) => {
    return [
      'traktors_4x4',
      'traktors_4x2',
      'traktors_kezu'
    ].includes(code ?? '');
  }
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
    <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
      <BThead class="position-sticky top-0 bg-primary in-front" >
        <BTr>
          <BTh v-if="!props.isModal" rowspan="2">Lauks</BTh>
          <BTh rowspan="2">Apstrādes operācija</BTh>
          <BTh rowspan="2">Tehnikas vienība</BTh>
          <BTh rowspan="1" colspan="2" class="text-center">Cena, EUR</BTh>
          <BTh rowspan="1" colspan="2" class="text-center">Gada noslodze, h</BTh>
          <BTh rowspan="2">Darba ražīgums, ha/h</BTh>
          <BTh rowspan="2">Degvielas patēriņš, l/ha</BTh>
          <BTh rowspan="2">&nbsp;</BTh>
        </BTr>
        <BTr>
          <BTh rowspan="1" class="text-center">Traktors</BTh>
          <BTh rowspan="1" class="text-center">Mašīna</BTh>
          <BTh rowspan="1" class="text-center">Traktors</BTh>
          <BTh rowspan="1" class="text-center">Mašīna</BTh>
        </BTr>
      </BThead>
      <BTbody v-if="operationStore.isLoading">
        <BTr>
          <BTd colspan="10" class="text-center">
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
            <div class="d-flex flex-row gap-3">
              <SimpleDropdown
                :is-loading="false"
                :get-filtered="equipmentCollectionStore.getFilteredTractorOrCombine"
                :get-formatted-option="equipmentCollectionStore.getFormattedOption"
                v-model="row.tractor_or_combine_id"
                @changed="operationStore.updateOperationAsync(row)"
              />
              <SimpleDropdown
                :is-loading="false"
                :is-invalid="row.machineValid"
                :get-filtered="equipmentCollectionStore.getFilteredMachines"
                :get-formatted-option="equipmentCollectionStore.getFormattedOption"
                v-model="row.machine_id"
                v-if="isTractor(row.tractorOrCombine?.equipment_type_code)"
                @changed="operationStore.updateOperationAsync(row)"
              />
            </div>

          </BTd>
          <BTd :colspan="isTractor(row.tractorOrCombine?.equipment_type_code) ? 1 : 2" class="text-center">
            {{ (row.tractorOrCombine?.price ?? 0).toFixed(2) }}
          </BTd>
          <BTd v-if="isTractor(row.tractorOrCombine?.equipment_type_code)" class="text-center">
            {{ (row.machine?.price ?? 0).toFixed(2) }}
          </BTd>
          <BTd :colspan="isTractor(row.tractorOrCombine?.equipment_type_code) ? 1 : 2" class="text-center">
            {{ (row.tractorOrCombine?.hoursPerYear ?? 0).toFixed(2) }} h
          </BTd>
          <BTd v-if="isTractor(row.tractorOrCombine?.equipment_type_code)" class="text-center">
            {{ (row.machine?.totalCurrentUsageHours ?? 0).toFixed(2) }} h
          </BTd>
          <BTd v-if="isTractor(row.tractorOrCombine?.equipment_type_code)" class="text-center">
            {{ (row.machine?.averageFieldWorkSpeed ?? 0).toFixed(2) }} ha/h
          </BTd>
          <BTd v-else class="text-center">
            {{ (row.tractorOrCombine?.averageFieldWorkSpeed ?? 0).toFixed(2) }} ha/h
          </BTd>
          <BTd class="text-center">
            {{ row.fuelUsagePerHectare.toFixed(2) }} l/ha <BBadge class="cursor-pointer" @click="() => showInfoModal('fuel_usage_info')">slodze <br/> {{ (row.loadFactorOnPowerMachine * 100).toFixed(2) }}%</BBadge>
          </BTd>
          <BTd>
            <BButtonGroup class="d-inline-flex flex-row btn-group">
              <BButton class="ms-auto flex-grow-0" variant="danger" size="sm" @click="operationStore.removeOperationAsync(row)">
                Dzēst <TrashIcon />
              </BButton>
            </BButtonGroup>
          </BTd>
        </BTr>

      </BTbody>
      <BTfoot class="position-sticky bottom-0 in-front">
        <BTr>
          <BTd colspan="9">
            <BButton variant="success" size="sm" @click="addNewOperation">Pievienot</BButton>
          </BTd>
        </BTr>
      </BTfoot>
    </BTableSimple>
  </div>
</template>

<style scoped>
  .table-height {
    max-height: 85vh;
    min-height: 50vh;
  }
  .in-front {
    z-index: 999;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
