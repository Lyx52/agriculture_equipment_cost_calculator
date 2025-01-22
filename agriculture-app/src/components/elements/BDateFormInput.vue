<script setup lang="ts">
import {BFormInput} from "bootstrap-vue-next";
import { ref, watch } from 'vue'
import { compareAsc, isValid } from "date-fns";
import { dateToStr, strToDate } from '@/utils.ts'
const model = defineModel<Date|undefined>();

const inputValue = ref<string>('');

inputValue.value = model.value ? dateToStr(model.value) : '';

watch(model, (newValue: Date|undefined) => {
  if (!newValue) {
    inputValue.value = "";
    return;
  }

  if (compareAsc(newValue!, strToDate(inputValue.value)) === 0) return;
  if (isValid(newValue!)) {
    inputValue.value = dateToStr(newValue!);
  }
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
