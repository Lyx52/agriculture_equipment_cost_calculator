<script setup lang="ts">
    import {BFormInput} from "bootstrap-vue-next";
    import {ref} from "vue";
    const model = defineModel<number>();
    const inputValue = ref<string>(model.value?.toFixed(2) ?? '');
    const onValueChange = () => {
        const value = Number(inputValue.value);
        inputValue.value = value?.toFixed(2) ?? '';
        model.value = isNaN(value) ? 0 : Math.fround(value * 100) / 100;
    }
</script>

<template>
    <BFormInput
        type="number"
        v-model="inputValue"
        min="0.00"
        @change="onValueChange"
    >
    </BFormInput>
</template>

<style scoped>

</style>
