<template>
    <div class="d-flex w-100">
        <BTableSimple hover no-border-collapse outlined caption-top  responsive class="w-100 mb-0 overflow-x-clip">
            <caption class="text-center fw-bold fs-5 border-bottom">
                Ekspluatācijas izmaksu novērtējums
            </caption>
            <BThead head-variant="dark">
                <BTr>
                    <BTh class="align-middle text-center">Nosaukums</BTh>
                    <BTh class="align-middle text-center">Kopējās uzkrātās stundas</BTh>
                    <BTh class="align-middle text-center">Remonta izmaksas (Pašreizējās)</BTh>
                    <BTh class="align-middle text-center">Remonta izmaksas (Kalpošanas beigās)</BTh>
                    <BTh class="align-middle text-center">Uzkrāto remontdarbu kopsumma</BTh>
                    <BTh class="align-middle text-center">Vidējās remonta izmaksas</BTh>
                    <BTh class="align-middle text-center">Degvielas patēriņš</BTh>
                    <BTh class="align-middle text-center">Degvielas izmaksas</BTh>
                    <BTh class="align-middle text-center">Smērvielu izmaksas</BTh>
                    <BTh class="align-middle text-center">Darbaspēka izmaksas</BTh>
                    <BTh class="align-middle text-center">Kopējās ekspluatācijas izmaksas</BTh>
                    <BTh class="align-middle text-center">Kopējās izmaksas</BTh>
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
                    <BTd class="align-middle text-center">
                        {{ (row.currentCostOfRepairCoefficient * 100).toFixed(2) }} %
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ (row.totalCostOfRepairCoefficient * 100).toFixed(2) }} %
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ row.currentCostOfRepair.toFixed(2) }} EUR
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ row.averageCostOfRepairPerHour.toFixed(2) }} EUR/h
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ row.fuelUsage.toFixed(2) }} l/h
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ row.totalFuelCost(generalInformationStore.fuelPrice).toFixed(2) }} EUR/h
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ row.totalLubricationCost(generalInformationStore.fuelPrice).toFixed(2) }} EUR/h
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ generalInformationStore.costPerEmployee.toFixed(2) }} EUR/h
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{
                            row.totalOperationCostPerHour(generalInformationStore.fuelPrice, generalInformationStore.costPerEmployee).toFixed(2)
                        }} EUR/h
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{
                            (
                                row.totalOperationCostPerHour(generalInformationStore.fuelPrice, generalInformationStore.costPerEmployee) +
                                row.getTotalEquipmentCostValuePerHour(generalInformationStore.interestRate, generalInformationStore.taxAndInsuranceRate)
                            ).toFixed(2)
                        }} EUR/h
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
import {useGeneralInformationStore} from "@/stores/generalInformation";
const equipmentCollectionStore = useEquipmentCollectionStore();
const generalInformationStore = useGeneralInformationStore();
</script>
<style scoped>

</style>
