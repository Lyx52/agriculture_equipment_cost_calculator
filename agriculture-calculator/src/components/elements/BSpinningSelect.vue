<script setup lang="ts">
import {BFormGroup, BFormSelect, BSpinner} from "bootstrap-vue-next";
import type {IBSpinningSelectProps} from "@/stores/interfaces/props/IBSpinningSelectProps";
defineProps<IBSpinningSelectProps>();
const model = defineModel();

</script>

<template>
    <BFormGroup >
        <label :for="id">{{ label }}</label>
        <div class="d-flex flex-nowrap">
            <BFormSelect
                :id="id"
                v-model="model"
                :options="options"
                :disabled="isSpinning" />
            <BSpinner class="ms-2 my-auto" small v-if="isSpinning" />
        </div>
    </BFormGroup>
</template>

<style scoped>

</style>
