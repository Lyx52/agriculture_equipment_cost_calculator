

<template>
    <div class="card shadow">
        <div class="card-body">
            <h5 class="card-title">Apstrādes operācijas</h5>
            <BTableSimple hover no-border-collapse outlined responsive class="w-100 mb-0 overflow-x-clip">
                <BThead head-variant="dark">
                    <BTr>
                        <BTh>Apstrādes operācija</BTh>
                        <BTh colspan="4">Traktors/Mašīna/Kombains</BTh>
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
                                :is-valid="isTractorValid(row)"
                                equipment-type-category="tractor"
                                :operation-type="row.operation"
                                @on-equipment-selected="onEquipmentSelected"
                            />
                        </BTd>
                        <BTd v-if="!['threshing', 'digging'].includes(row.operation)">
                            <BDropdownSelectEquipment
                                v-model="row.equipment"
                                :is-valid="true"
                                equipment-type-category="tractor_equipment"
                                :operation-type="row.operation"
                                @on-equipment-selected="onEquipmentSelected"
                            />
                        </BTd>
                        <BTd v-else colspan="2">
                            <BDropdownSelectEquipment
                                v-model="row.combine"
                                :is-valid="true"
                                equipment-type-category="combine"
                                :operation-type="row.operation"
                                @on-equipment-selected="onEquipmentSelected"
                            />
                        </BTd>
                        <BTd>
                            <BButtonGroup class="d-flex flex-row">
                                <BButton class="ms-auto flex-grow-0" variant="danger" size="sm" @click="operationCollectionStore.removeItem(row.uniqueId)">
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
    BFormSelect, BBadge, BPopover, BButtonGroup,
} from "bootstrap-vue-next";
import type {IOperation} from "@/stores/interfaces/IOperation";
import {useOperationCollectionStore} from "@/stores/operationCollection";
import {OperationOptions} from "@/stores/constants/OperationTypes";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import BDropdownSelectEquipment from "@/components/elements/BDropdownSelectEquipment.vue";
import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
import {useFarmlandCollectionStore} from "@/stores/farmlandCollection";
import type {OperationModel} from "@/stores/models/OperationModel";
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
const isTractorValid = (operationModel: OperationModel): boolean => {
    const hasEnoughPower =
        !!operationModel.tractor?.specification?.engine_power_kw &&
        operationModel.tractor?.specification?.engine_power_kw >= (operationModel.equipment?.specification?.required_power_kw ?? 0);

    return hasEnoughPower;
}
</script>
<style scoped>

</style>
