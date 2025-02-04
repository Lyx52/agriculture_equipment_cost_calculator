<script setup lang="ts">
  import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
  import { BTableSimple, BTbody, BTd, BTh, BThead, BTr, BBadge, BFormSelect, BInputGroup } from 'bootstrap-vue-next'
  import { useIndicatorStore } from '@/stores/indicator.ts'
  import { onMounted, ref } from 'vue'
  const indicatorStore = useIndicatorStore();
  const selectedCalculatePer = ref<string>('gadā');
  const calculatePerOptions = [
    { value: 'gadā', text: 'gadā' },
    { value: 'h', text: 'h' }
  ]
  onMounted(async () => {
    await indicatorStore.getInflationRate();
    await indicatorStore.getInterestRate();
    await indicatorStore.getConsumerPriceIndices();
    await indicatorStore.getMotorHoursByYear();
  });
  const equipmentCollectionStore = useEquipmentCollectionStore();
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <BInputGroup prepend="Aprēķināt" class="w-fit-content">
        <BFormSelect :options="calculatePerOptions" v-model="selectedCalculatePer" />
      </BInputGroup>
    </div>
    <div class="row">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
        <caption>
          <h5 class="text-center fw-bold text-black">Īpašuma izmaksu novērtējums</h5>
        </caption>
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh>Tehnikas vienība</BTh>
            <BTh>Tehnikas vecums</BTh>
            <BTh>Iegādes cena</BTh>
            <BTh>Pašreizējā cena</BTh>
            <BTh>Atgūstamā vērtība, EUR</BTh>
            <BTh>Amortizācijas kopsumma</BTh>
            <BTh>Kapitāla atgūšanas vērtība, {{ selectedCalculatePer }}</BTh>
            <BTh>Citas izmaksas (Apdrošināšana, pajumte u.c), {{ selectedCalculatePer }}</BTh>
            <BTh>Kopējās īpašumtiesības izmaksas, {{ selectedCalculatePer }}</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in equipmentCollectionStore.items" v-bind:key="row.id">
            <BTd>
              {{ row.equipment_type?.name }} - {{ row.manufacturer }} {{ row.model }} {{ equipmentCollectionStore.getPowerOrWorkingWidth(row) }}
            </BTd>
          </BTr>
        </BTbody>
      </BTableSimple>
    </div>
    <div class="row">
      <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-y-auto table-height">
        <caption>
          <h5 class="text-center fw-bold text-black">Ekspluatācijas izmaksu novērtējums</h5>
        </caption>
        <BThead class="position-sticky top-0 bg-primary in-front" >
          <BTr>
            <BTh>Tehnikas vienība</BTh>
            <BTh>Tehnikas vecums</BTh>
            <BTh>Iegādes cena</BTh>
            <BTh>Pašreizējā cena</BTh>
            <BTh>Uzkrātās remonta izmaksas (Eksplautācijas beigās), EUR</BTh>
            <BTh>Degvielas izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Smērvielu izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Remonta izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Darbaspēka izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
            <BTh>Kopējās izmaksas, EUR/{{ selectedCalculatePer }}</BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr v-for="row in equipmentCollectionStore.items" v-bind:key="row.id">
            <BTd>
              {{ row.equipment_type?.name }} - {{ row.manufacturer }} {{ row.model }} {{ equipmentCollectionStore.getPowerOrWorkingWidth(row) }}
            </BTd>

          </BTr>
        </BTbody>
      </BTableSimple>
    </div>
  </div>

</template>

<style scoped>
  .table-height {
    max-height: 40vh;
    min-height: 25vh;
  }
  .in-front {
    z-index: 999;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .vertical-align-middle {
    vertical-align: middle !important;
  }
  .w-fit-content {
    width: fit-content;
  }
</style>
