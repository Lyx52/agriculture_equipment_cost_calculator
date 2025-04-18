import { createRouter, createWebHistory } from 'vue-router'
import MyFarmlandsView from '@/views/MyFarmlandsView.vue'
import MyEquipmentView from '@/views/MyEquipmentView.vue'
import CostAnalysisView from '@/views/CostAnalysisView.vue'
import OperationsView from '@/views/OperationsView.vue'
import MyFarmView from '@/views/MyFarmView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import MyMaterialCostsView from '@/views/MyMaterialCostsView.vue'
import MyTeamAndProvidersView from '@/views/MyTeamAndProvidersView.vue'
import { Prefetch } from '@/stores/enums/Prefetch.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'farm',
      component: MyFarmView,
      meta: {
        authorized: true,
        prefetch: [
          Prefetch.UserFarmInfo,
          Prefetch.FetchAllIndicators,
          Prefetch.UserAdjustments,
          Prefetch.UserEquipment,
          Prefetch.UserCropTypes,
          Prefetch.UserOperationTypeCodifiers,
          Prefetch.UserAgriculturalOperationCodifiers,
          Prefetch.UserOperations,
          Prefetch.UserFarmlands
        ]
      }
    },
    {
      path: '/equipment',
      name: 'equipment',
      component: MyEquipmentView,
      meta: {
        authorized: true
      }
    },
    {
      path: '/farmland',
      name: 'farmlands',
      component: MyFarmlandsView,
      meta: {
        authorized: true,
        prefetch: [
          Prefetch.FetchAllIndicators,
          Prefetch.UserFarmlands,
          Prefetch.UserOperations,
          Prefetch.UserEquipment,
          Prefetch.UserAdjustments,
          Prefetch.UserCropTypes,
        ]
      }
    },
    {
      path: '/operations',
      name: 'operations',
      component: OperationsView,
      meta: {
        authorized: true,
        prefetch: [
          Prefetch.UserFarmlands,
          Prefetch.UserOperations,
          Prefetch.UserEquipment,
          Prefetch.UserAdjustments
        ]
      }
    },
    {
      path: '/crop_inventory',
      name: 'crop_inventory',
      component: MyMaterialCostsView,
      meta: {
        authorized: true,
        prefetch: [
          Prefetch.UserFarmlands,
          Prefetch.UserCropTypes,
          Prefetch.UserAdjustments
        ]
      }
    },
    {
      path: '/team_and_services',
      name: 'team_and_services',
      component: MyTeamAndProvidersView,
      meta: {
        authorized: true,
        prefetch: [
          Prefetch.UserAdjustments
        ]
      }
    },
    {
      path: '/cost_analysis',
      name: 'cost_analysis',
      component: CostAnalysisView,
      meta: {
        authorized: true,
        prefetch: [
          Prefetch.UserFarmInfo,
          Prefetch.UserAdjustments,
          Prefetch.UserEquipment,
          Prefetch.UserCropTypes,
          Prefetch.UserOperationTypeCodifiers,
          Prefetch.UserAgriculturalOperationCodifiers,
          Prefetch.UserOperations,
          Prefetch.UserFarmlands,
          Prefetch.FetchAllIndicators
        ]
      }
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
