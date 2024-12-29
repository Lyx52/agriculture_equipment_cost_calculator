import { defineStore } from 'pinia'
import { TinyEmitter } from 'tiny-emitter'
import type { IEquipment } from '@/stores/interface/IEquipment.ts'
import { getBackendUri } from '@/utils.ts'
import type { IEquipmentFilterStore } from '@/stores/interface/IEquipmentFilterStore.ts'

export const useEquipmentFilterStore = defineStore(`equipmentFilter`, {
  state(): IEquipmentFilterStore {
      return {
        items: [],
        emitter: new TinyEmitter(),
        searchText: '',
        selectedItem: undefined,
        filterTo: 50,
        equipmentTypeCodes: []
      }
  },
  actions: {
    resetFilters() {
      this.searchText = '';
      this.filterTo = 50;
      this.equipmentTypeCodes = [];
    },
    async fetchByFilters() {
      const params = new URLSearchParams();
      params.set('EquipmentTypeCode', this.equipmentTypeCodes.join(','));
      params.set('FilterTo', this.filterTo.toString());
      if (this.searchText.length >= 2) {
        params.set('Query', this.searchText);
      }

      const response = await fetch(`${getBackendUri()}/Equipment?${params.toString()}`)
      this.items = await response.json() as IEquipment[];
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
