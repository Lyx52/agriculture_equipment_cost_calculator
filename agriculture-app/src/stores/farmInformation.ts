import { defineStore } from 'pinia'
import type { IFarmInformationStore } from '@/stores/interface/IFarmInformationStore.ts'

export const useFarmInformationStore = defineStore('farmInformation', {
  state(): IFarmInformationStore {
      return {
        employeeWage: 15,
        otherExpensesPercentage: 1.0,
        lubricantExpensesPercentage: 15,
        fuelPrice: 0.8,
        name: ''
      }
  },
  actions: {

  },
  getters: {

  },
  persist: true
})
