<template>
    <div class="greetings">
        <BModal class="modal-xl" v-model="model"
            @hide="onClose"
            @show="onShow"
        >
            <div class="container-fluid">
                <div class="row row-cols-1 row-cols-sm-2">
                    <div class="col">
                        <TechnicalEquipmentSearchForm
                            :equipment-type-category="props.equipmentTypeCategory"
                            :equipment-filter-store-id="equipmentFilterStoreId"
                            @on-equipment-selected="onEquipmentSelected"
                        />
                    </div>
                    <div class="col">
<!--                        <TechnicalEquipmentInformationForm />-->
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="d-flex flex-row w-100">
                    <BButton @click="onAddEquipment" class="btn-success ms-auto">Pievienot</BButton>
                </div>
            </template>
        </BModal>
    </div>
</template>

<script setup lang="ts">
import {BModal, BButton} from "bootstrap-vue-next";
import TechnicalEquipmentSearchForm from "@/components/form/TechnicalEquipmentSearchForm.vue";
import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
import {useEquipmentInformationStore} from "@/stores/equipmentInformation";
import type {ITechnicalEquipmentModalProps} from "@/stores/interfaces/props/ITechnicalEquipmentModalProps";
import {v4 as uuid} from 'uuid';
import {useQuickEquipmentFilterStore} from "@/stores/quickEquipmentFilter";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";

const model = defineModel<boolean>();
const props = defineProps<ITechnicalEquipmentModalProps>()
const equipmentCollectionStore = useEquipmentCollectionStore();
const equipmentInformationStore = useEquipmentInformationStore();

const equipmentFilterStoreId = uuid();
const equipmentFilterStore = useQuickEquipmentFilterStore(equipmentFilterStoreId);

const onAddEquipment = () => {
    model.value = false;
    equipmentCollectionStore.pushItem(equipmentInformationStore.equipmentModel);
}
const onEquipmentSelected = (item: EquipmentInformationModel) => {
    equipmentInformationStore.$patch({
        equipmentModel: item,
    });
}
const onClose = () => {
    equipmentFilterStore.$reset();
    equipmentInformationStore.$reset();
}
const onShow = async () => {
    await equipmentFilterStore.fetchByFilters();
}
</script>

<style scoped>

</style>
