import { defineStore } from 'pinia'
import type { IIndicatorStore } from '@/stores/interface/IIndicatorStore.ts'
import { avg, getBackendUri, max } from '@/utils.ts'
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
        consumerPriceIndices: {} as Record<string, number>,
        motorHoursByYear: {} as Record<string, Record<string, number>>
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
    async getConsumerPriceIndices() {
      if (Object.keys(this.consumerPriceIndices).length) return this.consumerPriceIndices;
      const response = await fetch(`${getBackendUri()}/Indicators/ConsumerPriceIndices`)
      this.consumerPriceIndices = (await response.json() as Record<string, number>);
      return this.consumerPriceIndices;
    },
    async getMotorHoursByYear() {
      if (Object.keys(this.motorHoursByYear).length) return this.motorHoursByYear;
      const response = await fetch(`${getBackendUri()}/StaticData/HoursByYear`)
      this.motorHoursByYear = (await response.json() as Record<string, Record<string, number>>);
      return this.motorHoursByYear;
    },
    getCapitalRecoveryFactor(expectedAge: number) {
      const rate = (this.realInterestRate / 100);
      return rate * (Math.pow(1 + rate, expectedAge) / (Math.pow(1 + rate, expectedAge) - 1))
    },
    getConsumerPriceIndexFactor(purchaseYear: number, currentYear: number) {
      const years = Object.keys(this.consumerPriceIndices).map(v => Number(v));

      const currentIndex = this.consumerPriceIndices[years.includes(currentYear) ? currentYear : max(years)];
      const purchaseIndex = this.consumerPriceIndices[years.includes(purchaseYear) ? purchaseYear : max(years)];

      return isNaN(currentIndex / purchaseIndex) ? 0 : currentIndex / purchaseIndex;
    },
    getAverageHoursPerForCategory(categoryCode: string|undefined, yearOfManufacture: number): number {
      if (!categoryCode) return 300;
      if (!Object.keys(this.motorHoursByYear).includes(categoryCode.toUpperCase())) return 300;
      const categoryValues = this.motorHoursByYear[categoryCode.toUpperCase()];
      const years = Object.keys(categoryValues).map(v => Number(v));
      return years.includes(yearOfManufacture) ? categoryValues[yearOfManufacture] : 300;
    }
  },
  getters: {
    realInterestRate(state: IIndicatorStore) {
      return Number(state.interestRate.value ?? 0) - Number(state.inflationRate.value ?? 0);
    }
  }
})
