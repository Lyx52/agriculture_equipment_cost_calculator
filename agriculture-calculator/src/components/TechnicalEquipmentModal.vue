<template>
    <div class="greetings">
        <BButton @click="showModal = !showModal"> Toggle modal </BButton>
        <BModal class="modal-xl" v-model="showModal" :hideFooter="true">
            <div class="container-fluid">
                <div class="row row-cols-1 row-cols-sm-2">
                    <div class="col">
                        <div class="form-group">
                            <label for="inputMachineryCategory">Tehnikas jauda, kw</label>
                            <div class="d-flex flex-row mb-3">
                                <BButton
                                    variant="outline-secondary"
                                    @input="filterStore.onPowerFilterMoreThan"
                                    class="text-nowrap me-2"
                                >
                                    <span v-if="filterStore.powerFilterMoreThan">Vairāk nekā</span>
                                    <span v-if="!filterStore.powerFilterMoreThan">Mazāk nekā</span>
                                </BButton>
                                <BFormInput
                                    type="number"
                                    v-model="filterStore.power"
                                    trim aria-describedby="powerKw"
                                    @change="filterStore.fetchByFilters"
                                />
                                <label id="powerKw" class="mt-auto mb-auto ms-2">kw</label>
                            </div>
                        </div>
                        <BSpinningSelect
                            id="inputMachineryCategory"
                            label="Tehnikas kategorija"
                            @change="filterStore.onCategoryChange"
                            :is-spinning="filterStore.isLoading"
                            :options="filterStore.categoryOptions"
                            v-model="filterStore.selectedCategory"
                        />
                        <BSpinningSelect
                            id="inputMachinerySubCategory"
                            label="Tehnikas apakškategorija"
                            @change="filterStore.onSubCategoryChange"
                            :is-spinning="filterStore.isLoading"
                            :options="filterStore.filteredSubCategories"
                            v-model="filterStore.selectedSubCategory"
                        />
                        <BSpinningSelect
                            id="inputMachineryMark"
                            label="Tehnikas marka"
                            @change="filterStore.onMarkChange"
                            :is-spinning="filterStore.isLoading"
                            :options="filterStore.equipmentMarkOptions"
                            v-model="filterStore.selectedMark"
                        />
                        <BSpinningSelect
                            id="inputMachineryModel"
                            label="Tehnikas modelis"
                            @change="filterStore.onModelChange"
                            :is-spinning="filterStore.isLoading"
                            :options="filterStore.equipmentModelOptions"
                            v-model="filterStore.selectedModel"
                        />
                        <label for="searchDropdown">Meklēt tehniku</label>
                        <div class="dropdown" id="searchDropdown">
                            <BFormInput
                                v-model="filterStore.searchText"
                                @input="filterStore.fetchByFilters"
                                @click="filterStore.onSearchDropdownClick"
                                class="dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            />
                            <ul
                                class="dropdown-menu w-100 short-dropdown"
                                :class="{ show: filterStore.showSearchDropdown }"
                                @scroll="filterStore.onSearchDropdownScroll"
                            >
                                <li v-for="item in filterStore.filteredEquipment" class="item-height">
                                    <a class="dropdown-item" href="#" @click="onClickEquipment(item)">
                                        {{ item.fullEquipmentName }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col">
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
                            <BFormInput id="inputMachineryName" v-model="fullEquipmentName" trim />
                        </BFormGroup>
                        <BFormGroup
                            label="Iepirkuma cena (EUR)"
                            label-for="inputMachineryPrice"
                        >
                            <BFormInput
                                type="number"
                                id="inputMachineryPrice"
                                v-model="price" trim
                            />
                        </BFormGroup>
                        <BFormGroup
                            label="Mašīnas tips"
                            label-for="inputMachineryType"
                        >
                            <BFormSelect id="inputMachineryType" v-model="equipmentType" :options="equipmentTypes" />
                        </BFormGroup>
                        <BFormGroup
                            label="Mašīnas komplektācija"
                            label-for="inputMachineryEquipmentLevel"
                        >
                            <BFormSelect id="inputMachineryEquipmentLevel" v-model="equipmentLevelCode" :options="equipmentLevelTypes" />
                        </BFormGroup>
                        <div class="form-group mb-3">
                            <span class="fs-5 fw-lighter">Specifikācija</span>
                        </div>
                        <span id="specificationContainer">

                        </span>
                    </div>
                </div>
            </div>
            <div class="d-flex flex-row w-100 mt-3">
                <BButton @click="onAddEquipment" class="btn-success ms-auto">Pievienot</BButton>
            </div>
        </BModal>
    </div>
</template>

<script setup lang="ts">
import {BModal, BButton, BFormGroup, BFormInput, BDropdown, BDropdownItem, BBadge, BPopover, BFormSelect} from "bootstrap-vue-next";
import {onMounted, ref, toRefs} from "vue";
import {useEquipmentFilterStore} from "@/stores/equipmentFilter";
import BSpinningSelect from "@/components/BSpinningSelect.vue";
import {useEquipmentInformationStore} from "@/stores/equipmentInformation";
import type {IEquipmentInformation} from "@/stores/interfaces/IEquipmentInformation";
const filterStore = useEquipmentFilterStore();
const equipmentInformationStore = useEquipmentInformationStore();
const emit = defineEmits(['onEquipmentAdded']);
const {
    fullEquipmentName,
    equipmentType,
    equipmentLevelCode,
    price,
} = toRefs(equipmentInformationStore);
const equipmentTypes = [
    {value: 'tractor_2x4', text: 'Traktors 2x4'},
    {value: 'tractor_4x4', text: 'Traktors 4x4'},
    {value: 'harvester', text: 'Kombains'},
    {value: 'plough', text: 'Arkls'},
    {value: 'planter', text: 'Stādītājs'},
    {value: 'seeder', text: 'Sējmašīna'},
    {value: 'sprayer', text: 'Smidzinātājs'},
    {value: 'mower', text: 'Pļaujmašīna'},
    {value: 'chipper', text: 'Smalcinātājs'},
    {value: 'press', text: 'Prese'},
    {value: 'hay_tedder', text: 'Ārdītājs'},
    {value: 'rake', text: 'Grābeklis'},
    {value: 'transport', text: 'Transportlīdzeklis'},
    {value: 'other', text: 'Cits'},
];
const equipmentLevelTypes = [
    {value: 'base', text: 'Bāzes'},
    {value: 'medium', text: 'Vidējais'},
    {value: 'premium', text: 'Premium'},
];

const showModal = ref<boolean>(false);

onMounted(async() => {
    await filterStore.fetchEquipmentCategories();
})

const onAddEquipment = () => {
    showModal.value = false;
    emit('onEquipmentAdded', equipmentInformationStore.getEquipment);
    filterStore.$reset();
    equipmentInformationStore.$reset();
}
const getEquipmentType = (item: IEquipmentInformation) => {
    switch (item.subCategoryCode) {
        case 'agriculture_tractor':
            return 'tractor_2x4';
        case 'mowers':
            return 'mower';
        case 'combine_harvester':
            return 'harvester';
        case 'sprayer':
            return 'sprayer';
        default: return 'other'
    }
}
const onClickEquipment = (item: IEquipmentInformation) => {
    equipmentInformationStore.$patch({
        ...item,
        equipmentType: getEquipmentType(item),
    });
    filterStore.$patch({
        showSearchDropdown: false,
        searchText: '',
        selectedModel: '',
        selectedMark: '',
        selectedCategory: '',
        selectedSubCategory: ''
    });
}
</script>

<style scoped>
    .cursor-pointer {
        cursor: pointer;
    }
    .short-dropdown {
        max-height: 250px;
        overflow-y: auto;
    }
    .item-height {
        height: 24px !important;
    }
</style>