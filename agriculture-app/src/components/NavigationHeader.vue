<script setup lang="ts">
  import { BLink } from 'bootstrap-vue-next';
  import TractorIcon from '@/components/icons/TractorIcon.vue';
  import FarmlandIcon from '@/components/icons/FarmlandIcon.vue';
  import { ref } from 'vue';
  import CostIcon from '@/components/icons/CostIcon.vue'
  import OperationsIcon from '@/components/icons/OperationsIcon.vue'
  import IconHouseGear from '@/components/icons/IconHouseGear.vue'
  import IconSeedling from '@/components/icons/IconSeedling.vue'
  import { useAuthStore } from '@/stores/auth.ts'
  import IconLogin from '@/components/icons/IconLogin.vue'
  import IconLogout from '@/components/icons/IconLogout.vue'
  import IconUser from '@/components/icons/IconUser.vue'
  const authStore = useAuthStore();
  const isHovering = ref<boolean>(false);
</script>

<template>
  <header class="d-flex flex-column bg-primary navigation-header" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
      <li class="nav-item border-bottom border-top border-secondary" v-if="authStore.isLoggedIn">
        <BLink to="/" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <IconHouseGear />
          <Transition>
            <span v-if="isHovering">&nbsp;Mana saimniecība</span>
          </Transition>
        </BLink>
      </li>
      <li class="nav-item border-bottom border-top border-secondary" v-if="authStore.isLoggedIn">
        <BLink to="/equipment" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <TractorIcon />
          <Transition>
            <span v-if="isHovering">&nbsp;Mana tehnika</span>
          </Transition>
        </BLink>
      </li>
      <li class="nav-item border-bottom border-secondary" v-if="authStore.isLoggedIn">
        <BLink to="/farmland" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <FarmlandIcon />
          <Transition>
            <span v-if="isHovering">&nbsp;Mani lauki</span>
          </Transition>
        </BLink>
      </li>
      <li class="nav-item border-bottom border-secondary" v-if="authStore.isLoggedIn">
        <BLink to="/operations" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <OperationsIcon />
          <Transition>
            <span v-if="isHovering">&nbsp;Visas Apstrādes operācijas</span>
          </Transition>
        </BLink>
      </li>
      <li class="nav-item border-bottom border-secondary" v-if="authStore.isLoggedIn">
        <BLink to="/crop_inventory" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <IconSeedling />
          <Transition>
            <span v-if="isHovering">&nbsp;Manas kūltūraugu izmaksas</span>
          </Transition>
        </BLink>
      </li>
      <li class="nav-item border-bottom border-secondary" v-if="authStore.isLoggedIn">
        <BLink to="/cost_analysis" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <CostIcon />
          <Transition>
            <span v-if="isHovering">&nbsp;Izmaksu kopskats</span>
          </Transition>
        </BLink>
      </li>

    </ul>
    <ul class="nav nav-pills nav-flush flex-column mt-auto text-center">
      <Transition>
        <li class="nav-item border-bottom border-secondary" v-if="authStore.isLoggedIn && isHovering">
          <BLink to="/" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap user-email">
            <IconUser />
            <span>&nbsp;&nbsp;{{ authStore.email }}</span>
          </BLink>
        </li>
      </Transition>
      <li class="nav-item border-bottom border-secondary" v-if="!authStore.isLoggedIn">
        <BLink to="/auth/login" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <IconLogin />
          <Transition>
            <span v-if="isHovering">&nbsp;Pieslēgties</span>
          </Transition>
        </BLink>
      </li>
      <li class="nav-item border-bottom border-secondary" v-if="authStore.isLoggedIn">
        <BLink to="/auth/login" @click="authStore.logout()" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <IconLogout />
          <Transition>
            <span v-if="isHovering">&nbsp;Atslēgties</span>
          </Transition>
        </BLink>
      </li>
    </ul>
  </header>
</template>

<style scoped>
  .router-link-active:not(.user-email) {
    color: rgba(var(--bs-secondary-rgb)) !important;
    svg {
      fill: rgba(var(--bs-secondary-rgb)) !important;
    }
  }
  .navigation-header {
    svg {
      width: 24px !important;
      height: 24px !important;
    }
  }
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
    transition: opacity 0.25s ease;
  }
</style>
