import { defineStore } from 'pinia'
import type { IIndicatorStore } from '@/stores/interface/IIndicatorStore.ts'
import { getBackendUri } from '@/utils.ts'
import type { IIndicatorResponse } from '@/stores/interface/IIndicatorResponse.ts'

export const useIndicatorStore = defineStore('indicator', {
  state(): IIndicatorStore {
      return {
        interestRate: {
          value: 0,
          period: undefined
        },
        inflationRate: {
          value: 0,
          period: undefined
        },
      }
  },
  actions: {
    async getInflationRate() {
      if (this.inflationRate.period) return this.inflationRate.value;
      const response = await fetch(`${getBackendUri()}/Indicators/Inflation`)
      this.inflationRate = (await response.json() as IIndicatorResponse);
      return this.inflationRate.value;
    },
    async getInterestRate() {
      if (this.interestRate.period) return this.interestRate.value;
      const response = await fetch(`${getBackendUri()}/Indicators/InterestRate`)
      this.interestRate = (await response.json() as IIndicatorResponse);
      return this.interestRate.value;
    },
    getCapitalRecoveryFactor(expectedAge: number) {
      const rate = (this.realInterestRate / 100);
      return rate * (Math.pow(1 + rate, expectedAge) / (Math.pow(1 + rate, expectedAge) - 1))
    }
  },
  getters: {
    realInterestRate(state: IIndicatorStore) {
      return Number(state.interestRate.value ?? 0) - Number(state.inflationRate.value ?? 0);
    }
  }
})
