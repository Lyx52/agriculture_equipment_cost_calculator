import { defineStore } from 'pinia'
import { TinyEmitter } from 'tiny-emitter'
import type { IFarmInformationStore } from '@/stores/interface/IFarmInformationStore.ts'

export const useFarmInformationStore = defineStore('farmInformation', {
  state(): IFarmInformationStore {
      return {
        employeeWage: 15,
        otherExpensesPercentage: 1.0,
        lubricantExpensesPercentage: 15,
        name: '',
        emitter: new TinyEmitter()
      }
  },
  actions: {

  },
  getters: {

  },
  persist: true
})
