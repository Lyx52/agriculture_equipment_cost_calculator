<script setup lang="ts">
import IconPlusSquare from '@/components/icons/IconPlusSquare.vue'
import IconMinusSquare from '@/components/icons/IconMinusSquare.vue'
const model = defineModel<boolean>();
const onClickOpen = () => {
  model.value = !model.value;
}
</script>

<template>
  <button class="btn btn-sm btn-outline-secondary border-0" @click="onClickOpen">
    <IconMinusSquare v-if="model" />
    <IconPlusSquare v-else />
  </button>
</template>

<style scoped>

</style>
