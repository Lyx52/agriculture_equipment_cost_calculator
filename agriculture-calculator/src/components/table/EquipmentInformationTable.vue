<template>
    <div class="d-flex flex-column card shadow p-2">
        <div class="d-flex w-100">
            <BButton
                variant="success"
                class="mw-fit-content"
                @click="showEquipmentSearchForm = true"
            >
                Pievienot tehnikas vienību
            </BButton>
            <span class="fs-3 w-100 text-center">{{ props.title }}</span>
        </div>
        <BTable
            v-model:sort-by="sortBy"
            :sort-internal="true"
            :items="equipmentCollectionStore.getEquipmentByTypes(props.equipmentTypes)"
            :fields="tableFields"
            responsive
            small
        >
            <template #cell(fullEquipmentName)="row">
                <BFormInput v-model="row.item.fullEquipmentName" class="mw-fit-content" />
            </template>
            <template #cell(price)="row">
                <BFormInput
                    v-model="row.item.price" type="number"
                />
            </template>
            <template #cell(specification.weight)="row">
                <BFormInput
                    v-model="row.item.specification.weight" type="number"
                />
            </template>
            <template #cell(specification.power)="row">
                <BFormInput
                    v-model="row.item.specification.power" type="number"
                />
            </template>
            <template #cell(hoursOfUse)="row">
                <BFormInput
                    v-model="row.item.hoursOfUse" type="number"
                />
            </template>
            <template #cell(remainingUseYears)="row">
                <BFormInput
                    v-model="row.item.remainingUseYears" type="number"
                />
            </template>
            <template #cell(currentUseYears)="row">
                <BFormInput
                    v-model="row.item.currentUseYears" type="number"
                />
            </template>
            <template #cell(specification.work_capacity)="row">
                <BFormInput
                    v-model="row.item.specification.work_capacity" type="number"
                />
            </template>
            <template #cell(getCurrentHoursOfUse)="row">
               {{ row.item.getCurrentHoursOfUse() }}
            </template>
            <template #cell(getTotalEquipmentUseYears)="row">
                {{ row.item.getTotalEquipmentUseYears() }}
            </template>
            <template #cell(actions)="row">
                <BButton variant="danger" size="sm" @click="equipmentCollectionStore.removeItem(row.item.uniqueId)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </BButton>
            </template>
        </BTable>
        <TechnicalEquipmentModal
            v-model="showEquipmentSearchForm"
            :equipment-types="props.equipmentTypes"
        />
    </div>
</template>

<script setup lang="ts">
import {
    BTableSimple,
    BThead,
    BTr,
    BTh,
    BTbody,
    BTd,
    BFormInput,
    BButton,
    BTable,
    type BTableSortBy, type TableFieldRaw
} from "bootstrap-vue-next";
    import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
    import TechnicalEquipmentModal from "@/components/modal/TechnicalEquipmentModal.vue";
import {computed, onMounted, ref} from "vue";
    import type {
        ITechnicalEquipmentInformationProps
    } from "@/stores/interfaces/props/ITechnicalEquipmentInformationProps";
    import {EquipmentTypes} from "@/utils";
    import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
    const sortBy = ref<BTableSortBy[]>([]);
    const equipmentCollectionStore = useEquipmentCollectionStore();
    const showEquipmentSearchForm = ref<boolean>(false);
    const props = defineProps<ITechnicalEquipmentInformationProps>();


    const tableFields = computed(() => {
        let addedFields = [];
        for (const type of props.equipmentTypes) {
            if (['tractors', 'agricultural_harvesters'].includes(type)) {
                addedFields.push({
                    key: 'specification.power',
                    label: 'Jauda, kw',
                    sortable: true,
                    sortDirection: 'desc',
                });
            }
        }
        const baseFields: Exclude<TableFieldRaw<EquipmentInformationModel>, string>[] = [
            {
                key: 'equipmentType',
                label: 'Tips',
                sortable: false,
                formatter: (value: unknown) => EquipmentTypes[value],
                class: "align-middle text-center"
            },
            {
                key: 'fullEquipmentName',
                label: 'Nosaukums',
                sortable: true,
                sortDirection: 'desc',
            },
            {
                key: 'price',
                label: 'Cena, EUR',
                sortable: true,
                sortDirection: 'desc',
            },
            {
                key: 'specification.weight',
                label: 'Masa, kg',
                sortable: true,
                sortDirection: 'desc',
            },
            ...addedFields,
            {
                key: 'hoursOfUse',
                label: 'Gada noslodze, h',
                sortable: true,
                sortDirection: 'desc',
            },
            {
                key: 'currentUseYears',
                label: 'Ekspluatācijas laiks, gadi',
                sortable: true,
                sortDirection: 'desc',
            },
            {
                key: 'specification.work_capacity',
                label: 'Darba veiktspēja ha/h',
                sortable: true,
                sortDirection: 'desc',
            },
            {
                key: 'remainingUseYears',
                label: 'Atlikušais ekspluatācijas laiks, gadi',
                sortable: true,
                sortDirection: 'desc',
            },
            {
                key: 'getCurrentHoursOfUse',
                label: 'Uzkrātās stundas, h',
                sortable: true,
                sortDirection: 'desc',
                class: "align-middle text-center"
            },
            {
                key: 'getTotalEquipmentUseYears',
                label: 'Kopējais ekspluatācijas laiks, gadi',
                sortable: true,
                sortDirection: 'desc',
                class: "align-middle text-center"
            },
            {
                key: 'actions',
                label: '',
                sortable: false,
                class: "align-middle text-center"
            }
        ];
        return baseFields;
    })
</script>

<style scoped>

</style>