<script setup lang="ts">
  import { BLink } from 'bootstrap-vue-next';
  import TractorIcon from '@/components/icons/TractorIcon.vue';
  import FarmlandIcon from '@/components/icons/FarmlandIcon.vue';
  import { ref } from 'vue';
  import CostIcon from '@/components/icons/CostIcon.vue'
  import OperationsIcon from '@/components/icons/OperationsIcon.vue'
  import IconHouseGear from '@/components/icons/IconHouseGear.vue'

  const isHovering = ref<boolean>(false);
</script>

<template>
  <header class="d-flex flex-column bg-primary navigation-header" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
      <li class="nav-item border-bottom border-top border-secondary">
        <BLink to="/" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <IconHouseGear />
          <Transition>
            <span v-if="isHovering">&nbsp;Mana saimniecība</span>
          </Transition>
        </BLink>
      </li>
      <li class="nav-item border-bottom border-top border-secondary">
        <BLink to="/equipment" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <TractorIcon />
          <Transition>
            <span v-if="isHovering">&nbsp;Mana tehnika</span>
          </Transition>
        </BLink>
      </li>
      <li class="nav-item border-bottom border-secondary">
        <BLink to="/farmland" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <FarmlandIcon />
          <Transition>
            <span v-if="isHovering">&nbsp;Mani lauki</span>
          </Transition>
        </BLink>
      </li>
      <li class="nav-item border-bottom border-secondary">
        <BLink to="/operations" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <OperationsIcon />
          <Transition>
            <span v-if="isHovering">&nbsp;Apstrādes operācijas</span>
          </Transition>
        </BLink>
      </li>
      <li class="nav-item border-bottom border-secondary">
        <BLink to="/cost_analysis" class="nav-link p-3 bg-primary rounded-0 text-white text-start text-nowrap">
          <CostIcon />
          <Transition>
            <span v-if="isHovering">&nbsp;Izmaksu kopskats</span>
          </Transition>
        </BLink>
      </li>
    </ul>
  </header>
</template>

<style scoped>
  .router-link-active {
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
