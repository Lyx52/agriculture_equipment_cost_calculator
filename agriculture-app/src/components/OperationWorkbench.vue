
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
    BTfoot
  } from 'bootstrap-vue-next'
  import {v4 as uuid} from 'uuid';
  import { useFarmlandStore } from '@/stores/farmland.ts'
  import type { IFarmlandOperation } from '@/stores/interface/IFarmlandOperation.ts'
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
  import emitter from '@/stores/emitter.ts'
  import type { IOperationWorkbenchProps } from '@/props/IOperationWorkbenchProps.ts'
  const props = defineProps<IOperationWorkbenchProps>();
  const operationStore = useOperationStore();
  const farmlandStore = useFarmlandStore();
  const farmlandOperationStoreId = uuid();
  const farmlandOperationCodifierStore = useCodifierStore(farmlandOperationStoreId);
  const equipmentCollectionStore = useEquipmentCollectionStore();

  emitter.on(operationStore.getEmitterEvent(CollectionEvents.ItemAdded), async (item: IOperation) => {
    const codifierStore = useCodifierStore(item.id);
    await codifierStore.setSelectedByCode(item.operation?.operationCode);
  });

  const addNewOperation = () => {
    console.log(operationStore.filteredFarmlandId)
    operationStore.pushItem({
      id: '',
      farmlandId: operationStore.filteredFarmlandId,
      operation: {
        operationCode: 'operation_110',
        operationName: 'Aršana',
      } as IFarmlandOperation,
      tractorOrCombineId: undefined,
      machineId: undefined
    });
    operationStore.filteredFarmlandOperation = undefined;
    farmlandOperationCodifierStore.$reset();
  }
  const onOperationFiltered = (item: ICodifier) => {
    operationStore.filteredFarmlandOperation = {
      operationCode: item.code,
      operationName: item.name
    };
  }
  const hasFilters = () => {
    return !!operationStore.filteredFarmlandOperation || !!operationStore.filteredFarmlandId
  }
  const resetFilters = () => {
    farmlandOperationCodifierStore.$reset();
    operationStore.filteredFarmlandId = undefined;
    operationStore.filteredFarmlandOperation = undefined;
  }
  const onOperationSelected = (operation: IOperation, codifier: ICodifier) => {
    operation.operation = {
      operationName: codifier.name,
      operationCode: codifier.code
    };
    farmlandOperationCodifierStore.$reset();
    operationStore.filteredFarmlandOperation = undefined;
  }
  // Load all codifier definitions
  onMounted(async () => {
    const codifierTasks = operationStore.items.map((item) => {
      const store = useCodifierStore(item.id);
      return store.setSelectedByCode(item.operation?.operationCode)
    })
    await Promise.all(codifierTasks);
  })
  const isTractor = (code: string|undefined) => {
    return [
      'traktors_4x4',
      'traktors_4x2',
      'traktors_kezu'
    ].includes(code ?? '');
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
          <BTh rowspan="2">&nbsp;</BTh>
        </BTr>
        <BTr>
          <BTh rowspan="1" class="text-center">Traktors</BTh>
          <BTh rowspan="1" class="text-center">Mašīna</BTh>
          <BTh rowspan="1" class="text-center">Traktors</BTh>
          <BTh rowspan="1" class="text-center">Mašīna</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr v-for="row in operationStore.filteredItems" v-bind:key="row.id">
          <BTd v-if="!props.isModal">
            <SimpleDropdown
              :is-loading="false"
              :get-filtered="farmlandStore.getFiltered"
              :get-formatted-option="farmlandStore.getFormattedOption"
              v-model="row.farmlandId"
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
                v-model="row.tractorOrCombineId"
              />
              <SimpleDropdown
                :is-loading="false"
                :get-filtered="equipmentCollectionStore.getFilteredMachines"
                :get-formatted-option="equipmentCollectionStore.getFormattedOption"
                v-model="row.machineId"
                v-if="isTractor(row.tractorOrCombine?.equipment_type_code)"
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
          <BTd>
            <BButtonGroup class="d-inline-flex flex-row btn-group">
              <BButton class="ms-auto flex-grow-0" variant="danger" size="sm" @click="operationStore.removeItem(row.id)">
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
</style>
