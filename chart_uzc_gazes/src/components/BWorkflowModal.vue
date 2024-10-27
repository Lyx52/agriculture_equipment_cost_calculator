
<template>

        <BModal fullscreen v-model="model" :hideFooter="true" centered>
            <BOverlay
                :show="isSpinning"
                spinner-variant="primary"
                spinner-type="grow"
                spinner-small
                rounded="sm"
            >
                <div class="container-fluid">
                    <slot></slot>
                </div>
            </BOverlay>
        </BModal>
</template>

<script setup lang="ts">
    import {BOverlay, BModal} from "bootstrap-vue-next";
    import type {IBWorkflowModalProps} from "@/interfaces/IBWorkflowModalProps";
    defineProps<IBWorkflowModalProps>()
    const model = defineModel<boolean>();
</script>

<style scoped>

</style>