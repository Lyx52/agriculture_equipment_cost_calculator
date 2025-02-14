import { createRouter, createWebHistory } from 'vue-router'
import MyFarmlandsView from '@/views/MyFarmlandsView.vue'
import MyEquipmentView from '@/views/MyEquipmentView.vue'
import CostAnalysisView from '@/views/CostAnalysisView.vue'
import OperationsView from '@/views/OperationsView.vue'
import MyFarmView from '@/views/MyFarmView.vue'
import MyCropInventoryView from '@/views/MyCropInventoryView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'

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
      meta: {
        authorized: true
      }
    },
    {
      path: '/crop_inventory',
      name: 'crop_inventory',
      component: MyCropInventoryView,
    },
    {
      path: '/cost_analysis',
      name: 'cost_analysis',
      component: CostAnalysisView,
    },
    {
      path: '/auth/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/auth/login',
      name: 'login',
      component: LoginView,
    }
  ],
})

export default router
