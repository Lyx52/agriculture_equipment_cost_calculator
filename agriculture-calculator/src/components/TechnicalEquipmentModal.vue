<template>
    <div class="greetings">
        <BButton @click="showModal = !showModal"> Toggle modal </BButton>
        <BModal class="modal-xl" v-model="showModal" :hideFooter="true">
            <div class="d-flex justify-content-center" v-if="isLoading">
                <BSpinner large />
            </div>
            <div class="container-fluid">
                <div class="row row-cols-1 row-cols-sm-2">
                    <div class="col">
                        <div class="form-group">
                            <label for="inputMachineryCategory">Tehnikas jauda, kw</label>
                            <div class="d-flex flex-row mb-3">
                                <BButton
                                    variant="outline-secondary"
                                    @click="filterStore.powerFilterMoreThan = !filterStore.powerFilterMoreThan"
                                    class="text-nowrap me-2"
                                >
                                    <span v-if="filterStore.powerFilterMoreThan">Vairāk nekā</span>
                                    <span v-if="!filterStore.powerFilterMoreThan">Mazāk nekā</span>
                                </BButton>
                                <BFormInput type="number" v-model="filterStore.power" trim aria-describedby="powerKw" />
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
                        <label for="inputSearchBar">Meklēt tehniku</label>
                        <BDropdown v-model="showSearchDropdown" @click="showSearchDropdown = !showSearchDropdown" text="Dropdown Button" id="searchDropdown" class="test-class" menu-class="w-100" no-caret>
                            <template #button-content>
                                <BFormInput />
                            </template>
                            <BDropdownItem>Third Action</BDropdownItem>
                            <BDropdownItem active>Active action</BDropdownItem>
                            <BDropdownItem disabled>Disabled action</BDropdownItem>
                        </BDropdown>
                    </div>
                    <div id="tractorInfoContainer" class="col">
                        <a tabindex="-1" data-toggle="tooltip" data-placement="right" id="sourceTooltip" title="avots">
                            <span class="badge badge-secondary">Avots</span>
                        </a>
                        <div class="form-group">
                            <label for="inputMachineryName">Mašīnas marka un modelis</label>
                            <input type="text" class="form-control" id="inputMachineryName">
                        </div>
                        <div class="form-group">
                            <label for="inputMachineryPrice">Iepirkuma cena (EUR)</label>
                            <input type="number" class="form-control" id="inputMachineryPrice">
                        </div>
                        <div class="form-group">
                            <label for="inputMachineryType">Mašīnas tips</label>
                            <select class="form-control form-control-sm" id="inputMachineryType"></select>
                        </div>
                        <div class="form-group">
                            <label for="inputMachineryEquipmentLevel">Mašīnas komplektācija</label>
                            <select class="form-control form-control-sm" id="inputMachineryEquipmentLevel">
                                <option value="base" selected>Bāzes</option>
                                <option value="medium">Vidējais</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>
                        <div class="form-group mb-3">
                            <span class="fs-5 fw-lighter">Specifikācija</span>
                        </div>
                        <span id="specificationContainer"></span>
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
import {BModal, BButton, BSpinner, BFormGroup, BFormInput, BDropdown, BDropdownItem} from "bootstrap-vue-next";
import {onMounted, ref} from "vue";
import {useEquipmentFilterStore} from "@/stores/equipmentFilter";
import BSpinningSelect from "@/components/BSpinningSelect.vue";

const filterStore = useEquipmentFilterStore();

const isLoading = ref(false);
onMounted(async() => {
    await filterStore.fetchEquipmentCategories();
})


const showModal = ref(false);
const showSearchDropdown = ref(false);
const onAddEquipment = () => {
    showModal.value = false;
    console.log(ex1Selected)
}
const ex1Options = [
    {value: null, text: 'Please select an option'},
    {value: 'a', text: 'This is First option'},
    {value: 'b', text: 'Selected Option'},
    {value: {C: '3PO'}, text: 'This is an option with object value'},
    {value: 'd', text: 'This one is disabled', disabled: true},
]

const ex1Selected = ref(null)
</script>

<style scoped>
    .test-class {
        width: 100%;
        button {
            padding: 0px !important;
        }
    }
</style>