

<template>
    <div class="card shadow">
        <div class="card-body">
            <h5 class="card-title">Apstrādes operācijas</h5>
            <BTableSimple hover no-border-collapse outlined responsive class="w-100 mb-0 overflow-x-clip">
                <BThead head-variant="dark">
                    <BTr>
                        <BTh>Apstrādes operācija</BTh>
                        <BTh colspan="2">Traktors/Mašīna/Kombains</BTh>
                    </BTr>
                </BThead>
                <BTbody>
                    <BTr v-for="row in operationCollectionStore.rows">
                        <BTd>
                            <BFormSelect
                                v-model="row.farmland"
                                :options="farmlandCollectionStore.itemOptions"
                            />
                        </BTd>
                        <BTd>
                            <BFormSelect
                                v-model="row.operation"
                                :options="OperationOptions"
                            />
                        </BTd>
                        <BTd v-if="!['threshing', 'digging'].includes(row.operation)">
                            <BDropdownSelectEquipment
                                v-model="row.tractor"
                                equipment-type-category="tractor"
                                :operation-type="row.operation"
                                @on-equipment-selected="onEquipmentSelected"
                            />
                        </BTd>
                        <BTd v-if="!['threshing', 'digging'].includes(row.operation)">
                            <BDropdownSelectEquipment
                                v-model="row.equipment"
                                equipment-type-category="tractor_equipment"
                                :operation-type="row.operation"
                                @on-equipment-selected="onEquipmentSelected"
                            />
                        </BTd>
                        <BTd v-else colspan="2">
                            <BDropdownSelectEquipment
                                v-model="row.combine"
                                equipment-type-category="combine"
                                :operation-type="row.operation"
                                @on-equipment-selected="onEquipmentSelected"
                            />
                        </BTd>
                    </BTr>
                    <BTr>
                        <BTd colspan="4">
                            <BButton variant="success" size="sm" @click="addOperation">Pievienot</BButton>
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
    BFormSelect, BBadge, BPopover,
} from "bootstrap-vue-next";
import type {IOperation} from "@/stores/interfaces/IOperation";
import {useOperationCollectionStore} from "@/stores/operationCollection";
import {OperationOptions} from "@/stores/constants/OperationTypes";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import BDropdownSelectEquipment from "@/components/elements/BDropdownSelectEquipment.vue";
import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
import {useFarmlandCollectionStore} from "@/stores/farmlandCollection";
const operationCollectionStore = useOperationCollectionStore();
const equipmentCollectionStore = useEquipmentCollectionStore();
const farmlandCollectionStore = useFarmlandCollectionStore();

const addOperation = () => {
    operationCollectionStore.pushItem({
        operation: 'ploughing'
    } as IOperation);
}
const onEquipmentSelected = (item: EquipmentInformationModel) => {
    equipmentCollectionStore.pushItem(item);
}
</script>
<style scoped>

</style>
