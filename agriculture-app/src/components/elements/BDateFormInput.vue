<script setup lang="ts">
import {BFormInput} from "bootstrap-vue-next";
import { ref } from 'vue'
import type { IBDateFormInput } from '@/props/IBDateFormInput.ts'
import { toDateOrUndefined } from '@/utils.ts'
const model = defineModel<Date|undefined>();
const props = defineProps<IBDateFormInput>();
console.log(model.value)
const inputValue = ref<string>(toDateOrUndefined(model.value)?.toLocaleDateString() ?? toDateOrUndefined(props.defaultValue)?.toLocaleDateString() ?? '');

const onValueChange = () => {
  model.value = toDateOrUndefined(inputValue.value);
}

</script>

<template>
  <BFormInput
    type="date"
    v-model="inputValue"
    @change="onValueChange"
  >
  </BFormInput>
</template>

<style scoped>

</style>
