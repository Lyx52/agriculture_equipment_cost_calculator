import { defineStore } from 'pinia'
import type { IEquipment } from '@/stores/interface/IEquipment.ts'
import { getBackendUri } from '@/utils.ts'
import type { IEquipmentFilterStore } from '@/stores/interface/IEquipmentFilterStore.ts'
import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'
import { PowerFilterMax } from '@/constants/EquipmentFilterConstants.ts'

export const useEquipmentFilterStore = defineStore(`equipmentFilter`, {
  state(): IEquipmentFilterStore {
      return {
        items: [],
        searchText: '',
        selectedItem: undefined,
        filterTo: 50,
        equipmentTypeCodes: [],
        powerFilter: [0, PowerFilterMax],
        requiredPowerFilter: [0, PowerFilterMax],
      }
  },
  actions: {
    resetFilters() {
      this.searchText = '';
      this.filterTo = 50;
      this.equipmentTypeCodes = [];
      this.powerFilter = [0, PowerFilterMax];
      this.requiredPowerFilter = [0, PowerFilterMax];
    },
    async fetchByFilters() {

      const params = new URLSearchParams();
      params.set('EquipmentTypeCode', this.equipmentTypeCodes.join(','));
      params.set('FilterTo', this.filterTo.toString());

      if (this.powerFilter[0] > 0) {
        params.set('MinPower', this.powerFilter[0].toString());
      }
      if (this.powerFilter[1] < PowerFilterMax) {
        params.set('MaxPower', this.powerFilter[1].toString());
      }

      if (this.requiredPowerFilter[0] > 0) {
        params.set('RequiredMinPower', this.requiredPowerFilter[0].toString());
      }
      if (this.requiredPowerFilter[1] < PowerFilterMax) {
        params.set('RequiredMaxPower', this.requiredPowerFilter[1].toString());
      }

      if (this.searchText.length >= 2) {
        params.set('Query', this.searchText);
      }

      const response = await fetch(`${getBackendUri()}/Equipment?${params.toString()}`)
      this.items = (await response.json() as IEquipment[]);
      for (const item of this.items) {
        item.usage = {
          currentAge: 0,
          expectedAge: 15,
          hoursPerYear: 300,
        } as IEquipmentUsage
      }
    },
    setCategoryTypeCodes(codes: string[]) {
      this.equipmentTypeCodes = codes
    }
  },
  getters: {
    filteredItems(state: IEquipmentFilterStore): IEquipment[] {
      return state.items;
    }
  }
})
