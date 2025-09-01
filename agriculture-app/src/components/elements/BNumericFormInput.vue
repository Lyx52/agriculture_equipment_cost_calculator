<script setup lang="ts">
    import {BFormInput} from "bootstrap-vue-next";
    import { ref, watch } from 'vue'
    import type { IBNumericFormInput } from '@/props/IBNumericFormInput.ts'
    const model = defineModel<number>();
    const props = defineProps<IBNumericFormInput>();
    const emits = defineEmits(["changed"]);

    const getDecimalPlaces = (): number => {
      return props.decimalPlaces ?? 2;
    }

    const getDefaultInputValue = (): string => {
      return Number(0).toFixed(getDecimalPlaces())
    }

    const clampTo = (value: number|undefined, min: number|undefined, max: number|undefined): number|undefined => {
      return value ? Math.min(Math.max(value, min ?? Number.MIN_SAFE_INTEGER), max ?? Number.MAX_SAFE_INTEGER) : undefined;
    }

    const roundTo = (value: number|undefined, decimalPlaces: number): number|undefined => {
      return value ? Math.fround(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces) : undefined;
    }

    const inputValue = ref<string>(model.value?.toFixed(getDecimalPlaces()) ?? props.defaultValue?.toString() ?? getDefaultInputValue());
    watch(model, (value) => {
      inputValue.value = value?.toFixed(getDecimalPlaces()) ?? props.defaultValue?.toString() ?? getDefaultInputValue();
    })



    const onValueChange = () => {
        const value = clampTo(Number(inputValue.value), props.min, props.max);
        inputValue.value = value?.toFixed(getDecimalPlaces()) ?? props.defaultValue?.toString() ?? getDefaultInputValue();
        model.value = isNaN(value ?? Number.NaN) ? 0 : roundTo(value, getDecimalPlaces());
        emits("changed", model.value);
    }
</script>

<template>
    <BFormInput
        type="number"
        v-model="inputValue"
        :min="props.min ?? getDefaultInputValue()"
        :max="props.max ?? Number.MAX_SAFE_INTEGER"
        @change="onValueChange"
    >
    </BFormInput>
</template>

<style scoped>

</style>
