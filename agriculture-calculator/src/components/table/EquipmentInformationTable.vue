<template>
    <div>
        <div class="d-flex w-100">
            <BButton
                variant="success"
                class="mw-fit-content"
                @click="showModal = true"
            >
                Pievienot tehnikas vienību
            </BButton>
            <span class="fs-5 w-100 text-center">{{ EquipmentTypeCategories[props.equipmentTypeCategory] }}</span>
        </div>
        <div class="d-flex w-100">
            <BTableSimple hover no-border-collapse outlined responsive class="w-100 mb-0 overflow-x-clip">
                <BThead head-variant="dark">
                    <BTr>
                        <BTh>xx</BTh>
                    </BTr>
                </BThead>
                <BTbody>
                    <BTr v-for="row in equipmentCollectionStore.getEquipmentByTypeCategory(props.equipmentTypeCategory)">
                        <BTd>
                            {{ row.fullEquipmentName }}
                        </BTd>
                    </BTr>
                </BTbody>
            </BTableSimple>
        </div>
        <TechnicalEquipmentModal
            v-model="showModal"
            :equipmentTypeCategory="props.equipmentTypeCategory"
        />
    </div>
</template>

<script setup lang="ts">
    import {
        BButton,
        BTh, BTd, BTableSimple, BTr, BThead, BTbody
    } from "bootstrap-vue-next";
    import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
    import type {
        ITechnicalEquipmentInformationProps
    } from "@/stores/interfaces/props/ITechnicalEquipmentInformationProps";
    import {EquipmentTypeCategories} from "@/stores/constants/EquipmentTypes";
    import TechnicalEquipmentModal from "@/components/modal/TechnicalEquipmentModal.vue";
    import {ref} from "vue";

    const props = defineProps<ITechnicalEquipmentInformationProps>();

    const equipmentCollectionStore = useEquipmentCollectionStore();
    const showModal = ref<boolean>(false);

</script>

<style scoped>

</style>
