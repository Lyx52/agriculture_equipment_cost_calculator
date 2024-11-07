<template>
    <div>
        <div class="d-flex w-100">
            <BButton
                variant="success"
                class="mw-fit-content"
                @click="equipmentFilterStore.showSearchModal = true"
            >
                Pievienot tehnikas vienību
            </BButton>
            <span class="fs-5 w-100 text-center">{{ props.title }}</span>
        </div>
        <div class="d-flex">
            <BTable
                v-model:sort-by="sortBy"
                :sort-internal="true"
                :items="equipmentCollectionStore.getEquipmentByTypes(props.equipmentTypes)"
                :fields="tableFields"
                responsive
                small
            >
                <template #cell(equipmentType)="row">
                    {{ EquipmentTypes[row.item.equipmentType] }}
                </template>
                <template #cell(fullEquipmentName)="row">
                    <BFormInput
                        v-if="isEditMode"
                        v-model="row.item.fullEquipmentName"
                        class="mw-fit-content"
                    />
                    <span v-else>{{ row.item.fullEquipmentName }}</span>
                </template>
                <template #cell(price)="row">
                    <BFormInput
                        v-if="isEditMode"
                        v-model="row.item.price"
                        type="number"
                    />
                    <span v-else>{{ row.item.price }}</span>
                </template>
                <template #cell(specification.weight)="row">
                    <BFormInput
                        v-if="isEditMode"
                        v-model="row.item.specification.weight"
                        type="number"
                    />
                    <span v-else>{{ row.item.specification.weight }}</span>
                </template>
                <template #cell(specification.power)="row">
                    <BFormInput
                        v-if="isEditMode"
                        v-model="row.item.specification.power"
                        type="number"
                    />
                    <span v-else>{{ row.item.specification.power }}</span>
                </template>
                <template #cell(specification.required_power)="row">
                    <BFormInput
                        v-if="isEditMode"
                        v-model="row.item.specification.required_power"
                        type="number"
                    />
                    <span v-else>{{ row.item.specification.required_power }}</span>
                </template>
                <template #cell(hoursOfUse)="row">
                    <BFormInput
                        v-if="isEditMode"
                        v-model="row.item.hoursOfUse"
                        type="number"
                    />
                    <span v-else>{{ row.item.hoursOfUse }}</span>
                </template>
                <template #cell(remainingUseYears)="row">
                    <BFormInput
                        v-if="isEditMode"
                        v-model="row.item.remainingUseYears"
                        type="number"
                    />
                    <span v-else>{{ row.item.remainingUseYears }}</span>
                </template>
                <template #cell(currentUseYears)="row">
                    <BFormInput
                        v-if="isEditMode"
                        v-model="row.item.currentUseYears"
                        type="number"
                    />
                    <span v-else>{{ row.item.currentUseYears }}</span>
                </template>
                <template #cell(specification.work_capacity)="row">
                    <BFormInput
                        v-if="isEditMode"
                        v-model="row.item.specification.work_capacity"
                        type="number"
                    />
                    <span v-else>{{ row.item.specification.work_capacity }}</span>
                </template>
                <template #cell(getCurrentHoursOfUse)="row">
                   {{ row.item.getCurrentHoursOfUse() }}
                </template>
                <template #cell(getTotalEquipmentUseYears)="row">
                    {{ row.item.getTotalEquipmentUseYears() }}
                </template>
                <template #cell(actions)="row">
                    <BButtonGroup>
                        <BButton variant="primary" size="sm" @click="isEditMode = !isEditMode">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                            </svg>
                        </BButton>
                        <BButton variant="danger" size="sm" @click="equipmentCollectionStore.removeItem(row.item.uniqueId)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                        </BButton>
                    </BButtonGroup>
                </template>
            </BTable>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {
        BFormInput,
        BButton,
        BTable,
        BButtonGroup,
        type BTableSortBy,
        type TableFieldRaw
    } from "bootstrap-vue-next";
    import {useEquipmentCollectionStore} from "@/stores/equipmentCollection";
    import {computed, onMounted, ref} from "vue";
    import type {
        ITechnicalEquipmentInformationProps
    } from "@/stores/interfaces/props/ITechnicalEquipmentInformationProps";
    import {EquipmentTypes} from "@/utils";
    import type {EquipmentInformationModel} from "@/stores/models/EquipmentInformationModel";
    import {useEquipmentFilterStore} from "@/stores/equipmentFilter";
    const sortBy = ref<BTableSortBy[]>([]);
    const equipmentCollectionStore = useEquipmentCollectionStore();
    const equipmentFilterStore = useEquipmentFilterStore();
    const props = defineProps<ITechnicalEquipmentInformationProps>();
    const isEditMode = ref<boolean>(false);

    const tableFields = computed(() => {
        let addedFields: any = {};
        for (const type of props.equipmentTypes) {
            if (['tractors', 'agricultural_harvesters'].includes(type)) {
                addedFields['specification.power'] = {
                    key: 'specification.power',
                    label: 'Jauda, kw',
                    sortable: true,
                    sortDirection: 'desc',
                    class: "align-middle text-center"
                }
            } else {
                addedFields['specification.required_power'] = {
                    key: 'specification.required_power',
                    label: 'Nepieciešamā jauda, kw',
                    sortable: true,
                    sortDirection: 'desc',
                    class: "align-middle text-center"
                }
            }
        }
        const baseFields: Exclude<TableFieldRaw<EquipmentInformationModel>, string>[] = [
            {
                key: 'equipmentType',
                label: 'Tips',
                sortable: false,
                class: "align-middle text-center"
            },
            {
                key: 'fullEquipmentName',
                label: 'Nosaukums',
                sortable: true,
                sortDirection: 'desc',
                class: "align-middle text-center"
            },
            {
                key: 'price',
                label: 'Cena, EUR',
                sortable: true,
                sortDirection: 'desc',
                class: "align-middle text-center"
            },
            {
                key: 'specification.weight',
                label: 'Masa, kg',
                sortable: true,
                sortDirection: 'desc',
                class: "align-middle text-center"
            },
            ...Object.values(addedFields) as any[],
            {
                key: 'hoursOfUse',
                label: 'Gada noslodze, h',
                sortable: true,
                sortDirection: 'desc',
                class: "align-middle text-center"
            },
            {
                key: 'currentUseYears',
                label: 'Ekspluatācijas laiks, gadi',
                sortable: true,
                sortDirection: 'desc',
                class: "align-middle text-center"
            },
            {
                key: 'specification.work_capacity',
                label: 'Darba veiktspēja ha/h',
                sortable: true,
                sortDirection: 'desc',
                class: "align-middle text-center"
            },
            {
                key: 'remainingUseYears',
                label: 'Atlikušais ekspluatācijas laiks, gadi',
                sortable: true,
                sortDirection: 'desc',
                class: "align-middle text-center"
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
