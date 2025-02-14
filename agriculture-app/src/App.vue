<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navigation from '@/components/NavigationHeader.vue'
import { BModalOrchestrator, BToastOrchestrator, useToastController } from 'bootstrap-vue-next'
import emitter from '@/stores/emitter.ts';
import router from '@/router'
import { useAuthStore } from '@/stores/auth.ts'
const { show } = useToastController();
const authStore = useAuthStore();
import { useRecaptchaProvider } from 'vue-recaptcha'
useRecaptchaProvider();

emitter.on('error', (message: string) => {
  show?.({
    props: {
      body: message,
      variant: 'danger'
    }
  });
});
router.beforeEach((to, from, next) => {
    authStore.validateExpiration();
    // Redirect to login on unathorized
    if (to.meta?.authorized) {
        if (!authStore.isLoggedIn) {
            next({ name: 'login' });
            return;
        }
    }
    next();
});
</script>

<template>

  <main class="d-flex flex-row justify-content-start vh-100">
    <Navigation />
    <RouterView />
    <BModalOrchestrator />
    <BToastOrchestrator />
  </main>

</template>

<style scoped>

</style>
