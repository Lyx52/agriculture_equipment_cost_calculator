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
                        <BTh>Tehnikas vienība</BTh>
                        <BTh>Marka</BTh>
                        <BTh>Modelis</BTh>
                        <BTh v-if="isTractor || isCombine">Jauda, kw</BTh>
                        <BTh>Nolietojums, gadi</BTh>
                        <BTh>Ekonomiskais izmantošanas laiks, gadi</BTh>
                        <BTh>Kopējais ekspluatācijas laiks, gadi</BTh>
                        <BTh>Darba stundas gadā, h</BTh>
                        <BTh>&nbsp;</BTh>
                    </BTr>
                </BThead>
                <BTbody>
                    <BTr v-for="row in equipmentCollectionStore.getEquipmentByTypeCategory(props.equipmentTypeCategory)">
                        <BTd>
                            {{ EquipmentSubTypes[row.equipmentSubType] }}
                        </BTd>
                        <BTd>
                            {{ row.mark }}
                        </BTd>
                        <BTd>
                            {{ row.model }}
                        </BTd>
                        <BTd v-if="isTractor || isCombine">
                            <BNumericFormInput
                                v-model="row.specification.engine_power_kw"
                            ></BNumericFormInput>
                        </BTd>
                        <BTd>
                            <BNumericFormInput
                                v-model="row.usageInformation.currentUseYears"
                            ></BNumericFormInput>
                        </BTd>
                        <BTd>
                            <BNumericFormInput
                                v-model="row.usageInformation.remainingUseYears"
                            ></BNumericFormInput>
                        </BTd>
                        <BTd class="align-middle text-center">
                            {{ row.totalUsageYears }}
                        </BTd>
                        <BTd>
                            <BNumericFormInput
                                v-model="row.usageInformation.averageHoursPerYear"
                            ></BNumericFormInput>
                        </BTd>
                        <BTd>
                            <BButtonGroup>
                                <BButton variant="danger" size="sm" @click="equipmentCollectionStore.removeItem(row.uniqueId)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                    </svg>
                                </BButton>
                            </BButtonGroup>
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
        BTh,
        BTd,
        BTableSimple,
        BTr,
        BThead,
        BTbody,
        BFormInput,
        BButtonGroup
    } from "bootstrap-vue-next";
    import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
    import type {
        ITechnicalEquipmentInformationProps
    } from "@/stores/interfaces/props/ITechnicalEquipmentInformationProps";
    import {EquipmentSubTypes, EquipmentTypeCategories} from "@/stores/constants/EquipmentTypes";
    import TechnicalEquipmentModal from "@/components/modal/TechnicalEquipmentModal.vue";
    import {ref} from "vue";
    import BNumericFormInput from "@/components/elements/BNumericFormInput.vue";

    const props = defineProps<ITechnicalEquipmentInformationProps>();

    const equipmentCollectionStore = useEquipmentCollectionStore();
    const showModal = ref<boolean>(false);
    const isTractor = props.equipmentTypeCategory ===  'tractor';
    const isCombine = props.equipmentTypeCategory ===  'combine';
    const isEquipment = props.equipmentTypeCategory ===  'tractor_equipment';

</script>

<style scoped>

</style>
