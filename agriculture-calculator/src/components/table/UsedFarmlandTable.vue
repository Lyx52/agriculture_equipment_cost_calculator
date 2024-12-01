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
                        <BTh class="text-center" colspan="2">Ražas kalendārs</BTh>
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
                        <BTd>
                            <BButtonGroup class="d-flex flex-row">
                                <BButton class="ms-auto flex-grow-0" variant="danger" size="sm" @click="farmlandCollectionStore.removeItem(row.uniqueId)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                    </svg>
                                </BButton>
                            </BButtonGroup>
                        </BTd>
                    </BTr>
                    <BTr>
                        <BTd colspan="5">
                            <BButton variant="success" size="sm" @click="addFarmland">Pievienot</BButton>
                            <BButton class="ms-2" variant="success" size="sm" @click="farmlandCollectionStore.showMapModal = true">Pievienot no kartes</BButton>
                        </BTd>
                    </BTr>
                </BTbody>
            </BTableSimple>
            <FarmlandMapModal v-model="farmlandCollectionStore.showMapModal" @on-field-added="farmlandCollectionStore.onFarmlandSelected" />
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
    BInputGroup, BBadge, BPopover, BButtonGroup
} from "bootstrap-vue-next";
import {useFarmlandCollectionStore} from "@/stores/farmlandCollection";
import {CropCalendarHarvest, CropCalendarPlant, CropOptions} from "@/stores/constants/CropTypes";
import type {IFarmland} from "@/stores/interfaces/IFarmland";
import {v4 as uuid} from 'uuid';
import BNumericFormInput from "@/components/elements/BNumericFormInput.vue";
import FarmlandMapModal from "@/components/modal/FarmlandMapModal.vue";

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
