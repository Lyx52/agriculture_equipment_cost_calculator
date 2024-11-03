<template>
    <div class="col card shadow">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ title }}</h5>
            <BButton variant="primary" size="sm" @click="showModal = !showModal">
                Pievienot tehnikas vienību
            </BButton>
        </div>
        <TechnicalEquipmentModal v-model="showModal" @onEquipmentAdded="onEquipmentAdded" />
    </div>
</template>

<script setup lang="ts">
    import {BButton} from 'bootstrap-vue-next'
    import type {
        ITechnicalEquipmentInformationProps
    } from "@/stores/interfaces/props/ITechnicalEquipmentInformationProps";
    import TechnicalEquipmentModal from "@/components/TechnicalEquipmentModal.vue";
    import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
    import {ref} from "vue";

    defineProps<ITechnicalEquipmentInformationProps>();
    const showModal = ref<boolean>(false);
    const onEquipmentAdded = (item: IEquipmentInformation) => {
        console.log(item);
    }
</script>

<style scoped>

</style>