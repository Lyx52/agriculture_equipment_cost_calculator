<template>
    <div class="greetings">
        <BModal class="modal-xl" v-model="model" :hideFooter="true">
            <div class="container-fluid">
                <div class="row row-cols-1 row-cols-sm-2">
                    <div class="col">
                        <TechnicalEquipmentSearchForm :limit-categories-to="['tractors', 'agricultural_harvesters']" @on-equipment-selected="onClickEquipment" />
                    </div>
                    <div class="col">
                        <TechnicalEquipmentInformationForm />
                    </div>
                </div>
            </div>
            <div class="d-flex flex-row w-100 mt-3">
                <BButton @click="onAddEquipment" class="btn-success ms-auto">Pievienot</BButton>
            </div>
        </BModal>
    </div>
</template>

<script setup lang="ts">
import {BModal, BButton} from "bootstrap-vue-next";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import TechnicalEquipmentSearchForm from "@/components/TechnicalEquipmentSearchForm.vue";
import TechnicalEquipmentInformationForm from "@/components/TechnicalEquipmentInformationForm.vue";


const emit = defineEmits(['onEquipmentAdded']);

const model = defineModel<boolean>();
const onAddEquipment = () => {
    model.value = false;
    // emit('onEquipmentAdded', equipmentInformationStore.getEquipment);
    // equipmentInformationStore.$reset();
}

const onClickEquipment = (item: IEquipmentInformation) => {
    // equipmentInformationStore.$patch({
    //     ...item,
    //     equipmentType: getEquipmentType(item),
    // });

}
</script>

<style scoped>
    .cursor-pointer {
        cursor: pointer;
    }

</style>
