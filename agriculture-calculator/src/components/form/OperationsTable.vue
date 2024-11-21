

<template>
    <div class="d-flex w-100">
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
                            id="inputMachineryEquipmentLevel"
                            v-model="row.operation"
                            :options="OperationOptions"
                        />
                    </BTd>
                    <BTd v-if="row.operation === 'ploughing'">
                        <BDropdownSelectEquipment />
                    </BTd>
                    <BTd v-if="row.operation === 'ploughing'">
                        <BDropdownSelectEquipment />
                    </BTd>
                    <BTd v-else colspan="2">
                        <BDropdownSelectEquipment />
                    </BTd>
                </BTr>
                <BTr>
                    <BTd colspan="2">
                        <BButton variant="success" size="sm" @click="addOperation">Pievienot</BButton>
                    </BTd>
                </BTr>
            </BTbody>
        </BTableSimple>
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
} from "bootstrap-vue-next";
import type {IOperation} from "@/stores/interfaces/IOperation";
import {useOperationCollectionStore} from "@/stores/operationCollection";
import {OperationOptions} from "@/stores/constants/OperationTypes";
import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
import BDropdownSelectEquipment from "@/components/elements/BDropdownSelectEquipment.vue";
const operationCollectionStore = useOperationCollectionStore();
const addOperation = () => {
    operationCollectionStore.pushItem({
        operation: 'ploughing',
        equipment: [] as EquipmentInformationModel[]
    } as IOperation);
}
</script>
<style scoped>

</style>
