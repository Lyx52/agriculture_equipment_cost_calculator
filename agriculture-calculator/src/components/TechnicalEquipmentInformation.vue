<template>
    <div class="col card shadow">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ title }}</h5>
            <BButton variant="primary" size="sm" class="mb-3" @click="showModal = !showModal">
                Pievienot tehnikas vienību no kataloga
            </BButton>
            <TechnicalEquipmentInformationForm />
        </div>
        <TechnicalEquipmentModal v-model="showModal" @onEquipmentAdded="onEquipmentAdded"  equipment-types="" search-form-index=""/>
    </div>
</template>

<script setup lang="ts">
    import {BButton} from 'bootstrap-vue-next'
    import type {
        ITechnicalEquipmentInformationProps
    } from "@/stores/interfaces/props/ITechnicalEquipmentInformationProps";
    import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
    import {ref} from "vue";
    import TechnicalEquipmentInformationForm from "@/components/form/TechnicalEquipmentInformationForm.vue";

    defineProps<ITechnicalEquipmentInformationProps>();
    const showModal = ref<boolean>(false);
    const onEquipmentAdded = (item: IEquipmentInformation) => {
        console.log(item);
    }
</script>

<style scoped>

</style>
