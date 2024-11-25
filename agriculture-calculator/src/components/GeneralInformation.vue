<template>
    <div class="card">
        <div class="card-body d-flex flex-column shadow">
            <h5 class="card-title">Lauksaimniecības tehnikas pamatinformācija</h5>
            <div class="row">
                <div class="col">
                    <BInputGroup prepend="Apstrādājamā platība" append="ha">
                        <BNumericFormInput
                            v-model="generalInformationStore.propertyHectares"
                            id="propertySizeHectares"
                        />
                    </BInputGroup>
                    <BInputGroup class="mt-3" prepend="Degvielas cena" append="l/EUR">
                        <BNumericFormInput
                            v-model="generalInformationStore.fuelPrice"
                           id="fuelPriceEur"
                        />
                    </BInputGroup>
                    <BInputGroup class="mt-3" prepend="Darbaspēka atalgojums" append="EUR/h">
                        <BNumericFormInput
                            v-model="generalInformationStore.employeeWage"
                            id="employeeWageEur"
                        />
                    </BInputGroup>
                    <BInputGroup class="mt-3" prepend="Faktiskās darba stundas" append="%">
                        <BNumericFormInput
                            v-model="generalInformationStore.actualWorkingHours"
                            id="actualWorkingHours"
                        />
                    </BInputGroup>
                    <BInputGroup class="mt-3" prepend="Procentu likme" append="%">
                        <BNumericFormInput
                            v-model="generalInformationStore.interestRate"
                            id="interestRate"
                        />
                    </BInputGroup>
                    <BInputGroup class="mt-3" prepend="Nodokļi, apdrošināšana un uzturēšana" append="%">
                        <BNumericFormInput
                            v-model="generalInformationStore.taxAndInsuranceRate"
                            id="taxAndInsuranceRate"
                        />
                    </BInputGroup>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import {BInputGroup} from 'bootstrap-vue-next'
    import {useGeneralInformationStore} from "@/stores/propertyInformation";
    import BNumericFormInput from "@/components/elements/BNumericFormInput.vue";

    const generalInformationStore = useGeneralInformationStore()
</script>
<style scoped>

</style>
