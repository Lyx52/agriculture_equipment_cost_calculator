<script setup lang="ts">
  import { useFarmlandStore } from '@/stores/farmland.ts'
  import {
    BTableSimple,
    BTh,
    BTd,
    BTr,
    BThead,
    BTbody,
    BButtonGroup,
    BButton,
    BTfoot,
    BSpinner,
    BFormInput
  } from 'bootstrap-vue-next'
  import BNumericFormInput from '@/components/elements/BNumericFormInput.vue';
  import FarmlandSelectionMap from '@/components/FarmlandSelectionMap.vue';
  import type { ISelectedMapField } from '@/stores/interface/ISelectedMapField.ts'
  import TrashIcon from '@/components/icons/TrashIcon.vue'
  import OperationsIcon from '@/components/icons/OperationsIcon.vue'
  import type { IFarmland } from '@/stores/interface/IFarmland.ts'
  import { useOperationStore } from '@/stores/operation.ts'
  import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
  import { useCodifierStore } from '@/stores/codifier.ts'
  import { ref } from 'vue'
  import {v4 as uuid} from 'uuid';
  import emitter from '@/stores/emitter.ts'
  import FarmlandOperationsModal from '@/components/modal/FarmlandOperationsModal.vue'
  import SimpleDropdown from '@/components/elements/SimpleDropdown.vue'
  import { useCropsStore } from '@/stores/crops.ts'
  import FarmlandSupportTypesModal from '@/components/modal/FarmlandSupportTypesModal.vue'
  import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'
  import CostIcon from '@/components/icons/CostIcon.vue'
  import { useAdjustmentsStore } from '@/stores/adjustments.ts'
  const farmlandStore = useFarmlandStore();
  const operationStore = useOperationStore();
  const cropStore = useCropsStore();
  const adjustmentStore = useAdjustmentsStore();
  const selectedFarmland = ref<FarmlandModel|undefined>(undefined);
  const showFarmlandSupportTypesModal = ref<boolean>(false);
  emitter.on(farmlandStore.getEmitterEvent(CollectionEvents.ItemAdded), (item: IFarmland) => {
    const codifierStore = useCodifierStore(item.id);
    codifierStore.setSelectedByCode(item.product_code);
  });
  const addNewFarmland = async () => {
    const farmland: IFarmland = {
      id: uuid(),
      area: 1,
      title: '',
      product_code: 'crop_111',
      product_name: undefined
    };
    await farmlandStore.addFarmlandAsync(farmland);
  }

  const onMapFarmlandSelected = async (selectedFarmland: ISelectedMapField) => {
    await farmlandStore.addFarmlandAsync({
      id: uuid(),
      title: '',
      area: selectedFarmland.area,
      product_code: `crop_${selectedFarmland.productCode}`,
      product_name: selectedFarmland.productDescription
    });
  }

  const showFarmlandOperations = ref<boolean>(false);
  const onOpenOperationsWorkbench = async (farmland: IFarmland) => {
    operationStore.resetFilters();
    operationStore.$patch({
      filteredFarmlandId: farmland.id
    });
    showFarmlandOperations.value = true;
    await operationStore.fetchByFilters();
  }
  const onOpenFarmlandSupportTypes = async (farmland: FarmlandModel) => {
    await adjustmentStore.fetchByFilters();
    selectedFarmland.value = farmland;
    showFarmlandSupportTypesModal.value = true;
  }
</script>

<template>
  <div class="d-flex flex-column flex-1">
    <h4 class="card-title">Saimiecības lauki - zemes platības (Kopējā platība {{ farmlandStore.totalFarmlandArea.toFixed(2) }} ha)</h4>
    <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style flex-1">
      <BThead head-variant="dark" class="position-sticky top-0 in-front">
        <BTr>
          <BTh>Nosaukums</BTh>
          <BTh>Ražas veids</BTh>
          <BTh>Zemes platība, ha</BTh>
          <BTh>&nbsp;</BTh>
        </BTr>
      </BThead>
      <BTbody v-if="farmlandStore.isLoading">
        <BTr>
          <BTd colspan="3" class="text-center">
            <BSpinner v-if="true" />
          </BTd>
        </BTr>
      </BTbody>
      <BTbody v-else>
        <BTr v-for="row in farmlandStore.items" v-bind:key="row.id">
          <BTd class="text-center align-middle">
            <BFormInput @change="farmlandStore.updateFarmlandAsync(row)" v-model="row.title" />
          </BTd>
          <BTd class="text-center align-middle">
            <SimpleDropdown
              :is-loading="false"
              :is-invalid="false"
              :get-filtered="cropStore.getFilteredCropTypes"
              :get-formatted-option="cropStore.getFormattedOption"
              v-model="row.product_code"
              @changed="farmlandStore.updateFarmlandAsync(row)"
            />
          </BTd>
          <BTd class="text-center align-middle">
            <BNumericFormInput @changed="farmlandStore.updateFarmlandAsync(row)" v-model="row.area" />
          </BTd>
          <BTd class="text-end align-middle">
            <BButtonGroup class="d-inline-flex flex-row btn-group">
              <BButton class="ms-auto flex-grow-0 btn-icon" variant="danger" size="sm" @click="farmlandStore.removeFarmlandAsync(row.id)">
                Dzēst <TrashIcon />
              </BButton>
              <BButton variant="secondary" size="sm" @click="onOpenOperationsWorkbench(row)">
                Apstrādes operācijas <OperationsIcon />
              </BButton>
              <BButton variant="success" size="sm" @click="onOpenFarmlandSupportTypes(row)">
                Atbalsta veidi <CostIcon class="cost-icon" />
              </BButton>
            </BButtonGroup>
          </BTd>
        </BTr>

      </BTbody>
      <BTfoot class="position-sticky bottom-0 in-front">
        <BTr>
          <BTd colspan="5">
            <BButton variant="success" size="sm" @click="addNewFarmland">Pievienot</BButton>
            <BButton class="ms-2" variant="success" size="sm" @click="farmlandStore.showMapModal = true">Pievienot no kartes</BButton>
          </BTd>
        </BTr>
      </BTfoot>
    </BTableSimple>
  </div>
  <FarmlandSelectionMap v-model="farmlandStore.showMapModal" @on-field-added="onMapFarmlandSelected" />
  <FarmlandOperationsModal v-model="showFarmlandOperations" />
  <FarmlandSupportTypesModal :farmland="selectedFarmland" v-model="showFarmlandSupportTypesModal" />
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
  .cost-icon {
    width: 18px !important;
  }
</style>
