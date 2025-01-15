<script setup lang="ts">
import {BFormInput} from "bootstrap-vue-next";
import { ref, watch } from 'vue'
import { format, parse, compareAsc } from "date-fns";
const model = defineModel<Date|undefined>();
const internalDateFormat = "yyyy-MM-dd";
const inputValue = ref<string>('');

const strToDate = (value: string) => {
  return parse(value, internalDateFormat, new Date());
}

const dateToStr = (value: Date) => {
  return format(value, internalDateFormat);
}

watch(model, (newValue: Date|undefined) => {
  if (!newValue) {
    inputValue.value = "";
    return;
  }

  if (compareAsc(newValue!, strToDate(inputValue.value)) === 0) return;
  inputValue.value = dateToStr(newValue!);
})

const onValueChange = () => {
  model.value = strToDate(inputValue.value);
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
