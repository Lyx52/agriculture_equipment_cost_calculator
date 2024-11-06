<template>
    <div class="greetings">
        <BModal class="modal-xl" v-model="model" :hideFooter="true"
                @hide="onClose"
                @show="onShow"
        >
            <div class="container-fluid">
                <div class="row row-cols-1 row-cols-sm-2">
                    <div class="col">
                        <TechnicalEquipmentSearchForm
                            @on-equipment-selected="onEquipmentSelected"
                            :equipment-types="props.equipmentTypes"
                            ref="searchForm"
                        />
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
import TechnicalEquipmentSearchForm from "@/components/form/TechnicalEquipmentSearchForm.vue";
import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
import {useEquipmentInformationStore} from "@/stores/equipmentInformation";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
import TechnicalEquipmentInformationForm from "@/components/form/TechnicalEquipmentInformationForm.vue";
import type {ITechnicalEquipmentModalProps} from "@/stores/interfaces/props/ITechnicalEquipmentModalProps";
import {useEquipmentFilterStore} from "@/stores/equipmentFilter";
const model = defineModel<boolean>();
const props = defineProps<ITechnicalEquipmentModalProps>()
const equipmentCollectionStore = useEquipmentCollectionStore();
const equipmentInformationStore = useEquipmentInformationStore();
const equipmentFilterStore = useEquipmentFilterStore();
const onAddEquipment = () => {
    model.value = false;
    equipmentCollectionStore.pushItem(equipmentInformationStore.equipmentModel);
}
const onEquipmentSelected = async (item: IEquipmentInformation) => {
    equipmentInformationStore.$patch({
        ...item
    });
    equipmentFilterStore.$reset();
}
const onClose = () => {
    equipmentFilterStore.$reset();
    equipmentInformationStore.$reset();
}
const onShow = async () => {
    await equipmentFilterStore.fetchEquipmentCategories();
    equipmentFilterStore.$patch({
        currentSearchFormIndex: props.searchFormIndex
    })
}
</script>

<style scoped>

</style>
