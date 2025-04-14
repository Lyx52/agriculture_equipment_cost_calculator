/* eslint-disable  @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import type { IFarmInformationStore } from '@/stores/interface/IFarmInformationStore.ts'
import { fetchBackend, getBackendUri } from '@/utils.ts'
import emitter from '@/stores/emitter.ts'

export const useFarmInformationStore = defineStore('farmInformation', {
  state(): IFarmInformationStore {
      return {
        default_wage: 15,
        other_expenses_percentage: 1.0,
        lubrication_costs_percentage: 15,
        fuel_cost_per_liter: 0.8,
        farm_name: '',
        isLoading: false,
      }
  },
  actions: {
    async updateFarmInformationAsync() {
      this.isLoading = true;

      try {
        const res = await fetchBackend('POST', `${getBackendUri()}/Auth/UpdateFarmInfo`, {
          default_wage: this.default_wage,
          fuel_cost_per_liter: this.fuel_cost_per_liter,
          lubrication_costs_percentage: this.lubrication_costs_percentage,
          other_expenses_percentage: this.other_expenses_percentage,
          farm_name: this.farm_name,
        });
        if (!res.ok) {
          console.error(res);
          emitter.emit('error', `Neizdevās atjaunot lauksaimniecības informāciju`);
        }
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
      await this.fetchFarmInformationAsync();
    },
    async fetchFarmInformationAsync() {
      this.isLoading = true;

      try {
        const res = await fetchBackend('GET', `${getBackendUri()}/Auth/GetFarmInfo`);
        if (!res.ok) {
          console.error(res);
          emitter.emit('error', `Neizdevās izgūt lauksaimniecības informāciju`);
        }
        const data = await res.json();
        this.$state = {
          ...this.$state,
          ...data,
        }
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
    },
  },
  getters: {

  }
});
