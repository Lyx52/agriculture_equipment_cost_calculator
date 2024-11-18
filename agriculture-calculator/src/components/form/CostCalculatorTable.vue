

<template>
    <div>
        <div class="d-flex">
            <BTableSimple hover small responsive>
                <BThead head-variant="dark">
                    <BTr>
                        <BTh>Apstrādes operācija</BTh>
                        <BTh>Mašīna</BTh>
                    </BTr>
                </BThead>
                <BTbody>
                    <BTr v-for="row in costCalculationStore.rows">
                        <BTr>
                            <BTd>tractor</BTd>
                            <BTd>fff</BTd>
                        </BTr>
                        <BTr v-if="!row.isCombine">
                            <BTd>machine</BTd>
                            <BTd>xxx</BTd>
                        </BTr>
                    </BTr>
                    <BTr>
                        <BTd colspan="2">
                            <BButton variant="success" size="sm" @click="addNewCalculation">Pievienot</BButton>
                        </BTd>
                    </BTr>
                </BTbody>
            </BTableSimple>
        </div>
    </div>
</template>
<script setup lang="ts">
import {
    BFormInput,
    BButton,
    BTableSimple,
    BButtonGroup,
    type BTableSortBy,
    type TableFieldRaw, type TableItem, BFormSelect, BTr, BTd, BTbody, BThead, BTh
} from "bootstrap-vue-next";
import type {CostCalculationModel} from "@/stores/models/CostCalculationModel";
import {useCostCalculationStore} from "@/stores/costCalculation";
import type {ICostCalculation} from "@/stores/interfaces/ICostCalculation";
const tableFields: Exclude<TableFieldRaw<CostCalculationModel>, string>[] = [
    {
        key: 'operation',
        label: 'Apstrādes operācija',
        sortable: false,
        class: "align-middle text-center"
    },
    {
        key: 'equipmentType',
        label: 'Apstrādes operācija',
        sortable: false,
        class: "align-middle text-center"
    },
];
const costCalculationStore = useCostCalculationStore();
const addNewCalculation = () => {
    console.log(costCalculationStore.items)
    costCalculationStore.pushItem({
        operation: 'ploughing',
        equipmentType: 'tractor'
    } as ICostCalculation);
}
</script>
<style scoped>

</style>