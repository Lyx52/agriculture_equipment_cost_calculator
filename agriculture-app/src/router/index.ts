import { createRouter, createWebHistory } from 'vue-router'
import MyFarmlandsView from '@/views/MyFarmlandsView.vue'
import MyEquipmentView from '@/views/MyEquipmentView.vue'
import CostAnalysisView from '@/views/CostAnalysisView.vue'
import OperationsView from '@/views/OperationsView.vue'
import MyFarmView from '@/views/MyFarmView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'farm',
      component: MyFarmView,
    },
    {
      path: '/equipment',
      name: 'equipment',
      component: MyEquipmentView,
    },
    {
      path: '/farmland',
      name: 'farmlands',
      component: MyFarmlandsView,
    },
    {
      path: '/operations',
      name: 'operations',
      component: OperationsView,
    },
    {
      path: '/cost_analysis',
      name: 'cost_analysis',
      component: CostAnalysisView,
    }
  ],
})

export default router
