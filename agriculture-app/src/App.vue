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
import { AppVersion } from './main.ts'
import { usePrefetchStore } from '@/stores/prefetch.ts'
import type { Prefetch } from '@/stores/enums/Prefetch.ts'
useRecaptchaProvider();

emitter.on('error', (message: string) => {
  show?.({
    props: {
      body: message,
      variant: 'danger'
    }
  });
});
const prefetchStore = usePrefetchStore();
prefetchStore.initialize();
console.log("Initialize")
router.beforeEach((to, from, next) => {
    authStore.validateExpiration();
    // Redirect to login on unathorized
    if (to.meta?.authorized) {
        if (!authStore.isLoggedIn) {
            next({ name: 'login' });
            return;
        }
    }

    // Prefetch resources by keys
    if (to.meta?.prefetch) {
      const prefetch = to.meta?.prefetch ?? [];
      prefetchStore.executePrefetch(prefetch as Prefetch[]);
      console.log(to.meta?.prefetch)
    }

    next();
});


</script>

<template>

  <main class="d-flex flex-row justify-content-start main-container">
    <Navigation />
    <div class="d-flex flex-column w-100 h-100 content-container">
      <div class="content">
        <RouterView />
        <BModalOrchestrator />
        <BToastOrchestrator />
      </div>
      <div class="text-center">
        <p class="m-0">{{ AppVersion }}</p>
      </div>
    </div>

  </main>
</template>

<style scoped lang="scss">
  .main-container {
    min-height: 100vh !important;
    max-width: 100vw;
    overflow-x: hidden;
    height: 100% !important;
    .content-container {
      min-height: 100vh;
      margin-left: var(--navbar-width);
      z-index: 0;
      .content {
        padding: 0.25rem;
        flex: 1;
        display: flex;
        flex-flow: column;
        > .card {
          height: 100%;
          flex: 1;
        }
      }
    }
  }
</style>
