<template>
    <div class="card shadow">
        <div class="card-body d-flex flex-column">
            <div class="d-flex flex-row justify-content-between">
                <h5 class="card-title">Zemes platības</h5>
                <a class="ms-auto btn btn-sm btn-outline-secondary" href="https://ipad.fas.usda.gov/rssiws/al/crop_calendar/europe.aspx" target="_blank">Kalendāru avots</a>
            </div>
            <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 top-form-blocks">
                <BThead head-variant="dark" class="position-sticky top-0">
                    <BTr>
                        <BTh>Ražas veids</BTh>
                        <BTh>Zemes platība, ha</BTh>
                        <BTh class="text-center">Sējas kalendārs</BTh>
                        <BTh class="text-center">Ražas kalendārs</BTh>
                    </BTr>
                </BThead>
                <BTbody>
                    <BTr v-for="row in farmlandCollectionStore.items">
                        <BTd>
                            <BFormSelect
                                v-model="row.cropType"
                                :options="CropOptions"
                                @click="farmlandCollectionStore.updateCropCalendar(row.uniqueId)"
                            />
                        </BTd>
                        <BTd>
                            <BNumericFormInput v-model="row.area" />
                        </BTd>
                        <BTd>
                            <div class="d-flex flex-row gap-3">
                                <BInputGroup prepend="No">
                                    <BFormInput v-model="row.plantingInterval.from" type="date" />
                                </BInputGroup>
                                <BInputGroup prepend="Līdz">
                                    <BFormInput v-model="row.plantingInterval.to" type="date" />
                                </BInputGroup>
                            </div>
                        </BTd>
                        <BTd>
                            <div class="d-flex flex-row gap-3">
                                <BInputGroup prepend="No">
                                    <BFormInput v-model="row.harvestingInterval.from" type="date" />
                                </BInputGroup>
                                <BInputGroup prepend="Līdz">
                                    <BFormInput v-model="row.harvestingInterval.to" type="date" />
                                </BInputGroup>
                            </div>
                        </BTd>
                    </BTr>
                    <BTr>
                        <BTd colspan="4">
                            <BButton variant="success" size="sm" @click="addFarmland">Pievienot</BButton>
                        </BTd>
                    </BTr>
                </BTbody>
            </BTableSimple>
        </div>
    </div>
</template>
<script setup lang="ts">
import {
    BButton,
    BTableSimple,
    BTr,
    BTd,
    BTbody,
    BThead,
    BTh,
    BFormSelect,
    BFormInput,
    BInputGroup, BBadge, BPopover
} from "bootstrap-vue-next";
import {useFarmlandCollectionStore} from "@/stores/farmlandCollection";
import {CropCalendarHarvest, CropCalendarPlant, CropOptions} from "@/stores/constants/CropTypes";
import type {IFarmland} from "@/stores/interfaces/IFarmland";
import {v4 as uuid} from 'uuid';
import BNumericFormInput from "@/components/elements/BNumericFormInput.vue";

const farmlandCollectionStore = useFarmlandCollectionStore();
const addFarmland = () => {
    farmlandCollectionStore.pushItem({
        uniqueId: uuid(),
        area: 1,
        cropType: 'spring_wheat',
        plantingInterval: {
            ...CropCalendarPlant['spring_wheat']
        },
        harvestingInterval: {
            ...CropCalendarHarvest['spring_wheat']
        }
    } as IFarmland);
}
</script>
<style scoped>

</style>
