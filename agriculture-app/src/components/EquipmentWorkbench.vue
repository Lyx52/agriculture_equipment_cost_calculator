
<script setup lang="ts">
  import {
    BTableSimple,
    BThead,
    BTr,
    BTh,
    BTbody,
    BTd,
    BButton,
    BButtonGroup,
    BTfoot,
    BFormGroup,
    BSpinner
  } from 'bootstrap-vue-next'
  import TrashIcon from '@/components/icons/TrashIcon.vue'
  import EquipmentModal from '@/components/modal/EquipmentModal.vue'
  import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
  import OperationsIcon from '@/components/icons/OperationsIcon.vue'
  import { useEquipmentStore } from '@/stores/equipment.ts'
  import type { IEquipment } from '@/stores/interface/IEquipment.ts'
  import CodifierDropdown from '@/components/elements/CodifierDropdown.vue'
  import { Codifiers } from '@/stores/enums/Codifiers.ts'
  import type { ICodifier } from '@/stores/interface/ICodifier.ts'
  import IconX from '@/components/icons/IconX.vue'
  import { v4 as uuid } from 'uuid';
  import { useCodifierStore } from '@/stores/codifier.ts'
  import { onBeforeMount, onMounted, ref } from 'vue'
  import IconClockHistory from '@/components/icons/IconClockHistory.vue'
  import EquipmentUsageModal from '@/components/modal/EquipmentUsageModal.vue'
  import { useIndicatorStore } from '@/stores/indicator.ts'
  import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'
  import { DisplayNumber } from '../utils.ts'
  const equipmentCollectionStore = useEquipmentCollectionStore();
  const equipmentStore = useEquipmentStore();
  const equipmentCodifierStore = useCodifierStore(uuid());
  const equipmentCategoryTypeStore = useCodifierStore(uuid());
  const indicatorStore = useIndicatorStore();

  const equipmentUsage = ref<IEquipmentUsage>({
    use_hours_per_individual_years: false,
    hours_per_year: 0,
    expected_age: 0,
    hours_per_individual_years: {}
  });

  onMounted(async () => {
    await indicatorStore.getInflationRate();
    await indicatorStore.getInterestRate();
    await indicatorStore.getConsumerPriceIndices();
    await indicatorStore.getMotorHoursByYear();
    await equipmentCollectionStore.fetchByFilters();
  });

  onBeforeMount(async() => {
    equipmentCodifierStore.$reset();
    equipmentCodifierStore.$patch({
      addChildren: true,
      codifierTypeCodes: [Codifiers.EquipmentTypes]
    });
    await equipmentCodifierStore.fetchByFilters();
  })
  const onEditEquipment = (item: IEquipment) => {
    equipmentStore.fromEquipment(item);
    equipmentStore.$patch({
      showModal: true,
      editMode: true
    })
  }
  const onAddUsage = (item: IEquipment) => {
    equipmentStore.fromEquipment(item);
    equipmentUsage.value = item.usage;
    equipmentStore.$patch({
      showUsageModal: true
    });

  }
  const onAddEquipment = () => {
    equipmentStore.resetEquipment();
    equipmentStore.$patch({
      showModal: true,
      editMode: false
    })
  }
  const onEquipmentTypeSelected = (item: ICodifier) => {
    equipmentCollectionStore.$patch({
      equipmentCategoryTypeCode: item.code
    })
  }
  const hasFilters = (): boolean => {
    return !!equipmentCollectionStore.equipmentCategoryTypeCode;
  }
  const resetFilters = () => {
    equipmentCollectionStore.$patch({
      equipmentCategoryTypeCode: undefined
    });
    equipmentCategoryTypeStore.$reset();
  }
</script>

<template>
  <div class="d-flex flex-column h-100">
    <h4 class="card-title mb-3">Saimniecības tehnika</h4>
    <div class="d-flex flex-row gap-3">
      <BFormGroup label="Filtrēt pēc tehnikas tipa">
        <CodifierDropdown
          :is-valid="true"
          :parent-codifier-codes="equipmentCodifierStore.items.map(c => c.code)"
          @on-selected="onEquipmentTypeSelected"
          :store-id="equipmentCategoryTypeStore.storeId"
        />
      </BFormGroup>
      <BButton variant="danger" class="mt-auto ms-auto" v-if="hasFilters()" @click="resetFilters()">
        Atiestatīt filtrus <IconX />
      </BButton>
    </div>
    <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto common-table-style">
      <BThead class="position-sticky top-0 bg-primary in-front" >
        <BTr>
          <BTh>Tehnikas nosaukums</BTh>
          <BTh>Marka</BTh>
          <BTh>Modelis</BTh>
          <BTh>Iegādes gads</BTh>
          <BTh>Jauda/Nepieciešamā jauda, kw</BTh>
          <BTh>Darba platums, m</BTh>
          <BTh>Darba ražīgums, ha/h</BTh>
          <BTh>Uzkrātās darba stundas, h</BTh>
          <BTh>&nbsp;</BTh>
        </BTr>
      </BThead>
      <BTbody v-if="equipmentCollectionStore.isLoading">
        <BTr>
          <BTd colspan="10" class="text-center">
            <BSpinner v-if="true" />
          </BTd>
        </BTr>
      </BTbody>
      <BTbody v-else>
        <BTr v-for="row in equipmentCollectionStore.filteredItems" v-bind:key="row.id">
          <BTd>
            {{ row.equipment_type?.name }}
          </BTd>
          <BTd>
            {{ row.manufacturer }}
          </BTd>
          <BTd>
            {{ row.model }}
          </BTd>
          <BTd class="text-center">
            {{ DisplayNumber(row.itemPurchaseYear, 0) }}
          </BTd>
          <BTd class="text-center">
            {{ row.powerOrRequiredPower.toFixed(2) }}
          </BTd>
          <BTd class="text-center">
            {{ row.specifications.work_width ? row.specifications.work_width?.toFixed(2) : '' }}
          </BTd>
          <BTd class="text-center">
            {{ row.averageFieldWorkSpeed > 0 ? row.averageFieldWorkSpeed.toFixed(2) : '' }}
          </BTd>
          <BTd class="text-center">
            {{ row.totalCurrentUsageHours.toFixed(2) }}
          </BTd>
          <BTd>
            <BButtonGroup class="d-inline-flex flex-row btn-group">
              <BButton class="ms-auto flex-grow-0 btn-icon" variant="danger" size="sm" @click="equipmentCollectionStore.removeEquipmentAsync(row.id)">
                Dzēst <TrashIcon />
              </BButton>
              <BButton class="ms-auto flex-grow-0 btn-icon" variant="secondary" size="sm" @click="onEditEquipment(row)">
                Rediģēt <OperationsIcon />
              </BButton>
              <BButton class="ms-auto flex-grow-0 btn-icon" variant="info" size="sm" @click="onAddUsage(row)">
                Pievienot nolietojumu <IconClockHistory />
              </BButton>
            </BButtonGroup>
          </BTd>
        </BTr>
      </BTbody>
      <BTfoot class="position-sticky bottom-0 in-front">
        <BTr>
          <BTd colspan="9">
            <BButton variant="success" size="sm" @click="onAddEquipment">Pievienot</BButton>
          </BTd>
        </BTr>
      </BTfoot>
    </BTableSimple>
    <EquipmentModal v-model="equipmentStore.showModal" />
    <EquipmentUsageModal :usage="equipmentUsage" v-model="equipmentStore.showUsageModal" />
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
