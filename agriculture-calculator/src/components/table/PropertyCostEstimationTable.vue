<template>
    <div class="d-flex w-100">
        <BTableSimple hover no-border-collapse outlined caption-top  responsive class="w-100 mb-0 overflow-x-clip">
            <caption class="text-center fw-bold fs-5 border-bottom">
                Īpašuma izmaksu novērtējums, EUR
            </caption>
            <BThead head-variant="dark">
                <BTr>
                    <BTh>Nosaukums</BTh>
                    <BTh>Atlikusī vērtības</BTh>
                    <BTh>Atlikusī vērtība</BTh>
                    <BTh>Amortizācijas kopsumma</BTh>
                    <BTh>Kapitāla atgūšanas koeficients</BTh>
                    <BTh>Kapitāla atgūšana</BTh>
                    <BTh>Nodokļi, apdrošināšana un uzturēšana</BTh>
                    <BTh>Kopējās īpašuma izmaksas gadā</BTh>
                    <BTh>Tehnikas izmaksas</BTh>
                </BTr>
            </BThead>
            <BTbody>
                <BTr v-for="row in equipmentCollectionStore.items">
                    <BTd class="align-middle text-center">
                        {{ row.fullEquipmentName }}
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ (row.remainingValueCoefficient * 100).toFixed(2) }} %
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ row.remainingValue.toFixed(2)  }} EUR
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ row.depreciationValue.toFixed(2)  }} EUR
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ (row.getCapitalRecoveryCoefficientValue(generalInformationStore.interestRate) * 100).toFixed(2)  }} %
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ row.getCapitalRecoveryValue(generalInformationStore.interestRate).toFixed(2)  }} EUR
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ row.getTaxesAndInsuranceCostValue(generalInformationStore.taxAndInsuranceRate).toFixed(2)  }} EUR
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ row.getTotalEquipmentCostValue(generalInformationStore.interestRate, generalInformationStore.taxAndInsuranceRate).toFixed(2)  }} EUR
                    </BTd>
                    <BTd class="align-middle text-center">
                        {{ row.getTotalEquipmentCostValuePerHour(generalInformationStore.interestRate, generalInformationStore.taxAndInsuranceRate).toFixed(2)  }} EUR/h
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
