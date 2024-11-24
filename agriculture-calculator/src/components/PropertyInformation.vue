<template>
    <div class="card">
        <div class="card-body d-flex flex-column shadow">
            <h5 class="card-title">Lauksaimniecības informācija</h5>
            <p class="card-text">Īsa informācija par jūsu lauksaimniecības īpašumu</p>
            <div class="row">
                <div class="col">
                    <BInputGroup prepend="Apstrādājamā platība" append="ha">
                        <BNumericFormInput
                            v-model="propertyInformationStore.propertyHectares"
                            id="propertySizeHectares"
                        />
                    </BInputGroup>
                    <BInputGroup prepend="Degvielas cena, EUR" append="l/EUR">
                        <BNumericFormInput
                            v-model="propertyInformationStore.fuelPrice"
                           id="fuelPriceEur"
                        />
                    </BInputGroup>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import {BFormFloatingLabel, BFormInput, BInputGroup} from 'bootstrap-vue-next'
    import {usePropertyInformationStore} from "@/stores/propertyInformation";
    import BNumericFormInput from "@/components/elements/BNumericFormInput.vue";

    const propertyInformationStore = usePropertyInformationStore()
</script>
<style scoped>

</style>