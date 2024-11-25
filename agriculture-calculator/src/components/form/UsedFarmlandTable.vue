<template>
    <div class="card shadow">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">Zemes platības</h5>
            <BTableSimple hover no-border-collapse outlined responsive caption-top class="w-100 mb-0 overflow-x-clip top-form-blocks">
                <BThead head-variant="dark">
                    <BTr>
                        <BTh>Ražas veids</BTh>
                        <BTh>Zemes platība, ha</BTh>
                    </BTr>
                </BThead>
                <BTbody>
                    <BTr v-for="row in farmlandCollectionStore.items">
                        <BTd>
                            <BFormSelect
                                v-model="row.cropType"
                                :options="CropOptions"
                            />
                        </BTd>
                        <BTd>
                            <BNumericFormInput v-model="row.area" />
                        </BTd>
                    </BTr>
                    <BTr>
                        <BTd colspan="3">
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
    BFormSelect
} from "bootstrap-vue-next";
import {useFarmlandCollectionStore} from "@/stores/farmlandCollection";
import {CropOptions} from "@/stores/constants/CropTypes";
import type {IFarmland} from "@/stores/interfaces/IFarmland";
import {v4 as uuid} from 'uuid';
import BNumericFormInput from "@/components/elements/BNumericFormInput.vue";

const farmlandCollectionStore = useFarmlandCollectionStore();
const addFarmland = () => {
    farmlandCollectionStore.pushItem({
        uniqueId: uuid(),
        area: 1,
        cropType: 'summer_wheat'
    } as IFarmland);
}
</script>
<style scoped>

</style>
