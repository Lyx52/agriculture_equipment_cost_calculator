<script setup lang="ts">
  import { useFarmlandStore } from '@/stores/farmland.ts'
  import { BTableSimple, BTh, BTd, BTr, BThead, BTbody, BInputGroup, BFormInput, BButtonGroup, BButton, BTfoot } from 'bootstrap-vue-next';
  import BNumericFormInput from '@/components/elements/BNumericFormInput.vue';
  import FarmlandSelectionMap from '@/components/FarmlandSelectionMap.vue';
  import { DefaultDateIntervalHarvest, DefaultDateIntervalPlant } from '../../defaults.ts'
  import type { IDateInterval } from '@/stores/interface/IDateInterval.ts'
  import type { ISelectedMapField } from '@/stores/interface/ISelectedMapField.ts'
  import CodifierDropdown from '@/components/elements/CodifierDropdown.vue'
  import { Codifiers } from '@/stores/enums/Codifiers.ts'
  import type { IFarmlandProduct } from '@/stores/interface/IFarmlandProduct.ts'
  import TrashIcon from '@/components/icons/TrashIcon.vue'
  import OperationsIcon from '@/components/icons/OperationsIcon.vue'
  import type { IFarmland } from '@/stores/interface/IFarmland.ts'
  import { useOperationStore } from '@/stores/operation.ts'
  import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
  import { useCodifierStore } from '@/stores/codifier.ts'
  import type { ICodifier } from '@/stores/interface/ICodifier.ts'
  import { onMounted, ref } from 'vue'
  import emitter from '@/stores/emitter.ts'
  import FarmlandOperationsModal from '@/components/modal/FarmlandOperationsModal.vue'
  const farmlandStore = useFarmlandStore();
  const operationStore = useOperationStore();

  emitter.on(farmlandStore.getEmitterEvent(CollectionEvents.ItemAdded), (item: IFarmland) => {
    const codifierStore = useCodifierStore(item.id);
    codifierStore.$patch({
      selectedItem: {
        name: item.product?.productName,
        code: `crop_${item.product?.productCode}`,
        value: item.product?.productCode,
        parent_code: Codifiers.CropTypes,
      } as ICodifier
    });
  });

  const addNewFarmland = () => {
    farmlandStore.pushItem({
      id: '',
      area: 1,
      product: {
        productCode: '111',
        productName: 'Vasaras, Kvieši'
      } as IFarmlandProduct,
      harvestInterval: {
        ...DefaultDateIntervalHarvest
      } as IDateInterval,
      plantInterval: {
        ...DefaultDateIntervalPlant
      } as IDateInterval,
    });
  }
  const onMapFarmlandSelected = (selectedFarmland: ISelectedMapField) => {
    farmlandStore.pushItem({
      id: '',
      area: selectedFarmland.area,
      product: {
        productCode: selectedFarmland.productCode,
        productName: selectedFarmland.productDescription
      } as IFarmlandProduct,
      harvestInterval: {
        ...DefaultDateIntervalHarvest
      } as IDateInterval,
      plantInterval: {
        ...DefaultDateIntervalPlant
      } as IDateInterval,
    });
  }
  const showFarmlandOperations = ref<boolean>(false);
  const onOpenOperationsWorkbench = (farmland: IFarmland) => {
    operationStore.resetFilters();
    operationStore.$patch({
      filteredFarmlandId: farmland.id
    })
    showFarmlandOperations.value = true
  }
  const onCropTypeSelected = (cropType: ICodifier, farmland: IFarmland) => {
    farmland.product = {
      productCode: cropType.value ?? '',
      productName: cropType.name
    }
  }
  // Load all codifier definitions
  onMounted(async () => {
    const codifierTasks = farmlandStore.items.map((item) => {
      const store = useCodifierStore(item.id);
      return store.setSelectedByCode(`crop_${item.product?.productCode}`)
    });
    await Promise.all(codifierTasks)
  })
</script>

<template>
  <div class="d-flex flex-column">
    <h5 class="card-title">Zemes platības (Kopējā platība {{ farmlandStore.totalFarmlandArea.toFixed(2) }} ha)</h5>
    <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
      <BThead head-variant="dark" class="position-sticky top-0 in-front">
        <BTr>
          <BTh>Ražas veids</BTh>
          <BTh>Zemes platība, ha</BTh>
          <BTh class="text-center">Sējas kalendārs</BTh>
          <BTh class="text-center" colspan="2">Ražas kalendārs</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr v-for="row in farmlandStore.items" v-bind:key="row.id">
          <BTd>
            <CodifierDropdown
              :is-valid="true"
              :parent-codifier-codes="[Codifiers.CropTypes]"
              :store-id="row.id"
              @onSelected="(codifier) => onCropTypeSelected(codifier, row)"
            />
          </BTd>
          <BTd>
            <BNumericFormInput v-model="row.area" />
          </BTd>
          <BTd>
            <div class="d-flex flex-row gap-3">
              <BInputGroup prepend="No">
                <BFormInput v-model="row.plantInterval.from" type="date" />
              </BInputGroup>
              <BInputGroup prepend="Līdz">
                <BFormInput v-model="row.plantInterval.to" type="date" />
              </BInputGroup>
            </div>
          </BTd>
          <BTd>
            <div class="d-flex flex-row gap-3">
              <BInputGroup prepend="No">
                <BFormInput v-model="row.harvestInterval.from" type="date" />
              </BInputGroup>
              <BInputGroup prepend="Līdz">
                <BFormInput v-model="row.harvestInterval.to" type="date" />
              </BInputGroup>
            </div>
          </BTd>
          <BTd>
            <BButtonGroup class="d-inline-flex flex-row btn-group">
              <BButton class="ms-auto flex-grow-0" variant="danger" size="sm" @click="farmlandStore.removeItem(row.id)">
                Dzēst <TrashIcon />
              </BButton>
              <BButton variant="secondary" size="sm" @click="onOpenOperationsWorkbench(row)">
                Apstrādes operācijas <OperationsIcon />
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
