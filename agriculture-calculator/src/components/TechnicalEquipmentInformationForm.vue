<template>
    <div class="d-flex flex-column w-100">
        <div class="d-flex flex-row">
            <BPopover
                class="ms-auto"
                :click="true"
                :close-on-hide="true"
                :delay="{show: 0, hide: 0}"
                placement="right"
            >
                <template #default>
                    <div class="d-flex flex-column">
                        <a class="link-secondary text-decoration-none" v-for="source in equipmentInformationStore.dataSources" :href="source.href">{{ source.text }}</a>
                    </div>
                </template>
                <template #target>
                    <BBadge variant="secondary" class="cursor-pointer ms-auto">
                        Avots
                    </BBadge>
                </template>
            </BPopover>
        </div>
        <BFormGroup
            label="Mašīnas marka un modelis"
            label-for="inputMachineryName"
        >
            <BFormInput id="inputMachineryName" v-model="equipmentInformationStore.fullEquipmentName" trim />
        </BFormGroup>
        <BFormGroup
            label="Iepirkuma cena (EUR)"
            label-for="inputMachineryPrice"
        >
            <BFormInput
                type="number"
                id="inputMachineryPrice"
                v-model="equipmentInformationStore.price" trim
            />
        </BFormGroup>
        <BFormGroup
            label="Mašīnas komplektācija"
            label-for="inputMachineryEquipmentLevel"
        >
            <BFormSelect id="inputMachineryEquipmentLevel" v-model="equipmentInformationStore.equipmentLevelCode" :options="equipmentLevelTypes" />
        </BFormGroup>
    </div>
</template>
<script setup lang="ts">

import {BBadge, BFormGroup, BFormInput, BFormSelect, BPopover} from "bootstrap-vue-next";
import {useEquipmentInformationStore} from "@/stores/equipmentInformation";
const equipmentInformationStore = useEquipmentInformationStore();

</script>
<style scoped>

</style>