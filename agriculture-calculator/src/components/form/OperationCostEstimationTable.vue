<template>
    <div class="d-flex w-100">
        <BTableSimple hover no-border-collapse outlined caption-top  responsive class="w-100 mb-0 overflow-x-clip">
            <caption class="text-center fw-bold fs-5 border-bottom">
                Ekspluatācijas izmaksu novērtējums
            </caption>
            <BThead head-variant="dark">
                <BTr>
                    <BTh>Nosaukums</BTh>
                    <BTh>Kopējās uzkrātās stundas</BTh>
                </BTr>
            </BThead>
            <BTbody>
                <BTr v-for="row in equipmentCollectionStore.items">
                    <BTd class="align-middle text-center">
                        {{ row.fullEquipmentName }}
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ row.totalLifetimeHours.toFixed(2) }} h
                    </BTd>
                </BTr>
            </BTbody>
        </BTableSimple>
    </div>
</template>
<script setup lang="ts">
import {
    BTableSimple,
    BTr,
    BTd,
    BTbody,
    BThead,
    BTh,
} from "bootstrap-vue-next";
import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
import {useGeneralInformationStore} from "@/stores/propertyInformation";
const equipmentCollectionStore = useEquipmentCollectionStore();
const generalInformationStore = useGeneralInformationStore();
</script>
<style scoped>

</style>
