<script setup lang="ts">
    import {BFormInput} from "bootstrap-vue-next";
    import { ref, watch } from 'vue'
    import type { IBNumericFormInput } from '@/props/IBNumericFormInput.ts'
    const model = defineModel<number>();
    const props = defineProps<IBNumericFormInput>();
    const emits = defineEmits(["changed"]);
    const inputValue = ref<string>(model.value?.toFixed(2) ?? props.defaultValue?.toString() ?? '0.00');
    watch(model, (value) => {
      inputValue.value = value?.toFixed(2) ?? props.defaultValue?.toString() ?? '0.00';
    })
    const onValueChange = () => {
        const value = Number(inputValue.value);
        inputValue.value = value?.toFixed(2) ?? props.defaultValue?.toString() ?? '0.00';
        model.value = isNaN(value) ? 0 : Math.fround(value * 100) / 100;
        emits("changed", model.value);
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
