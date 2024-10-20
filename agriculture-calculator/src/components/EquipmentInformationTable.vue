<script setup lang="ts">
    import { BTableSimple, BThead, BTr, BTh, BTbody, BTd, BFormInput, BFormSelect } from "bootstrap-vue-next";
    import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
    const equipmentCollectionStore = useEquipmentCollectionStore();
    const operationTypes = [
        {
            value: "threshing",
            text: "Kulšana"
        },
        {
            value: "ploughing",
            text: "Aršana"
        },
        {
            value: "cultivation",
            text: "Kultivēšana"
        },
        {
            value: "fertilizing",
            text: "Minerālmēslu-izkliedēšana"
        },
        {
            value: "sowing",
            text: "Sēja"
        },
        {
            value: "harrowing",
            text: "Ecēšana"
        },
        {
            value: "spraying",
            text: "Smidzināšana"
        },
        {
            value: "row_cultivation",
            text: "Rindstarpu-kultivēšana"
        },
        {
            value: "water_supply",
            text: "Ūdens pievešana"
        },
        {
            value: "transporting",
            text: "Transportēšana"
        },
        {
            value: "paring",
            text: "Lobīšana"
        },
        {
            value: "intermediate_sowing",
            text: "Starpsēja"
        }
    ]
</script>

<template>
    <div class="container-fluid">
        <div class="row row-cols-1">
            <div class="col">
                <div class="d-flex w-100">
                    <span class="fs-3 w-100 text-center">Tehnikas vienības</span>
                </div>

                <BTableSimple responsive>
                    <BThead>
                        <BTr>
                            <BTh sticky-column>Nosaukums</BTh>
                            <BTh sticky-column>Cena, EUR</BTh>
                            <BTh sticky-column>Masa, kg</BTh>
                            <BTh sticky-column>Jauda, kw</BTh>
                            <BTh sticky-column>Nepieciešamā jauda, kw</BTh>
                            <BTh sticky-column>Līdz šim uzkrātās stundas, h</BTh>
                            <BTh sticky-column>Gada noslodze, h</BTh>
                            <BTh sticky-column>Ekspluatācijas laiks, gadi</BTh>
                            <BTh sticky-column>Atlikušais ekspluatācijas laiks, gadi</BTh>
                            <BTh sticky-column>Darba veiktspēja ha/h vai tonnas/h</BTh>
                            <BTh sticky-column>Kopējais ekspluatācijas laiks, gadi</BTh>
                        </BTr>
                    </BThead>
                    <BTbody>
                        <BTr v-for="item in equipmentCollectionStore.items">
                            <BTd>
                                <BFormInput v-model="item.fullEquipmentName" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.price" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.specification.weight" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.specification.power" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.specification.required_power" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.currentHoursOfUse" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.hoursOfUse" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.currentUseYears" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.remainingUseYears" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.specification.work_capacity" type="number" />
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ Number(item.currentUseYears ?? 0) + Number(item.remainingUseYears ?? 0) }}
                            </BTd>
                        </BTr>
                    </BTbody>
                </BTableSimple>
            </div>
            <div class="col">
                <div class="d-flex w-100">
                    <span class="fs-3 w-100 text-center">????</span>
                </div>
                <BTableSimple responsive>
                    <BThead>
                        <BTr>
                            <BTh>Mašīnas nosaukums</BTh>
                            <BTh>Darbības veids</BTh>
                            <BTh>Aizvietojamās tehnikas cena, EUR</BTh>
                            <BTh>Procentu likme, %</BTh>
                            <BTh>Degvielas cena, EUR/l</BTh>
                            <BTh>Degvielas izmantošanas koef</BTh>
                            <BTh>Smērvielu izmaksas no degvielas izmaksām, %</BTh>
                            <BTh>Darbaspēka atalgojums stundā, EUR</BTh>
                            <BTh>Faktiskās darba stundas[10 līdz 20 %], %</BTh>
                            <BTh>Nodokļi, apdrošināšana un uzturēšana, %</BTh>
                        </BTr>
                    </BThead>
                    <BTbody>
                        <BTr v-for="item in equipmentCollectionStore.items">
                            <BTd class="align-middle text-center">
                                {{ item.fullEquipmentName }}
                            </BTd>
                            <BTd>
                                <BFormSelect :options="operationTypes" v-model="item.mainInfo.operationType" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.mainInfo.replacementPrice" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.mainInfo.rate" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.mainInfo.fuelPrice" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.mainInfo.fuelUsageCoefficient" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.mainInfo.totalCostFromLubricantsRate" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.mainInfo.employeeWage" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.mainInfo.actualWorkingHours" type="number" />
                            </BTd>
                            <BTd>
                                <BFormInput v-model="item.mainInfo.totalCostFromOtherCosts" type="number" />
                            </BTd>
                        </BTr>
                    </BTbody>
                </BTableSimple>
            </div>
            <div class="col">
                <div class="d-flex w-100">
                    <span class="fs-3 w-100 text-center fw-bold my-3">Īpašuma izmaksu novērtējums, EUR</span>
                </div>
                <BTableSimple responsive>
                    <BThead>
                        <BTr>
                            <BTh>Mašīnas nosaukums</BTh>
                            <BTh>Atlikusī vērtības, %</BTh>
                            <BTh>Atlikusī vērtība, EUR</BTh>
                            <BTh>Amortizācijas kopsumma, EUR</BTh>
                            <BTh>Kapitāla atmaksāšanās koeficients</BTh>
                            <BTh>Kapitāla atgūšana, EUR</BTh>
                            <BTh>Nodokļi, apdrošināšana un uzturēšana, EUR</BTh>
                            <BTh>Kopējās īpašuma izmaksas gadā, EUR</BTh>
                            <BTh>Īpašuma izmaksas stundā, EUR</BTh>
                        </BTr>
                    </BThead>
                    <BTbody>
                        <BTr v-for="item in equipmentCollectionStore.items">
                            <BTd class="align-middle text-center">
                                {{ item.fullEquipmentName }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ (item.getRemainingValue() * 100).toFixed(2) }} %
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getRemainingValueEUR().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ (Number(item.price ?? 0) - item.getRemainingValueEUR()).toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getCapitalRecoveryValue().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getTotalCapitalRecovery().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getTotalOtherCosts().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ (item.getTotalOtherCosts() + item.getTotalCapitalRecovery()).toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getPropertyCosts().toFixed(2) }}
                            </BTd>
                        </BTr>
                    </BTbody>
                </BTableSimple>
            </div>
            <div class="col">
                <div class="d-flex w-100">
                    <span class="fs-3 w-100 text-center fw-bold my-3">Ekspluatācijas izmaksu novērtējums</span>
                </div>
                <BTableSimple responsive>
                    <BThead>
                        <BTr>
                            <BTh>Mašīnas nosaukums</BTh>
                            <BTh>Uzkrāto stundu skaits ekspluatācijas laika beigās</BTh>
                            <BTh>Remonta izmaksas (tekošās), %</BTh>
                            <BTh>Remonta izmaksas (viss ekspluatācijas laiks), %</BTh>
                            <BTh>Uzkrāto remontdarbu kopsumma, EUR</BTh>
                            <BTh>Vidējās remonta izmaksas stundā, EUR</BTh>
                            <BTh>Degvielas patēriņš, litri/h</BTh>
                            <BTh>Degvielas izmaksas stundā, EUR</BTh>
                            <BTh>Smērvielu izmaksas stundā, EUR</BTh>
                            <BTh>Darbaspēka izmaksas stundā, EUR</BTh>
                            <BTh>Kopējās ekspluatācijas izmaksas stundā</BTh>
                            <BTh>Kopējās izmaksas stundā</BTh>
                        </BTr>
                    </BThead>
                    <BTbody>
                        <BTr v-for="item in equipmentCollectionStore.items">
                            <BTd class="align-middle text-center">
                                {{ item.fullEquipmentName }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getTotalLifetimeHours().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getCostOfRepairCurrent().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getTotalCostOfRepair().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getAccumulatedRepairs().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getAverageRepairCosts().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getFuelUsage().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getTotalFuelCosts().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getLubricantsUseCosts().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ item.getEmployeeWageCosts().toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ (item.getAverageRepairCosts() + item.getTotalFuelCosts() + item.getLubricantsUseCosts() + item.getEmployeeWageCosts()).toFixed(2) }}
                            </BTd>
                            <BTd class="align-middle text-center">
                                {{ (item.getAverageRepairCosts() + item.getTotalFuelCosts() + item.getLubricantsUseCosts() + item.getEmployeeWageCosts() + item.getPropertyCosts()).toFixed(2) }}
                            </BTd>
                        </BTr>
                    </BTbody>
                </BTableSimple>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>