import { defineStore } from 'pinia'
import { TinyEmitter } from 'tiny-emitter'
import type { ICodifierStore } from '@/stores/interface/ICodifierStore.ts'
import type { ICodifier } from '@/stores/interface/ICodifier.ts'
import { getBackendUri } from '@/utils.ts'
export const useCodifierStore = (storeId: string) => defineStore(`codifier_${storeId}`, {
  state(): ICodifierStore {
    return {
      items: [],
      codifierTypeCode: '',
      searchText: '',
      emitter: new TinyEmitter(),
      filterTo: 25,
      selectedItem: undefined
    }
  },
  actions: {
    async fetchByFilters() {
      const params = new URLSearchParams();
      params.set('ParentCodifierCode', this.codifierTypeCode);
      params.set('FilterTo', this.filterTo.toString());
      if (this.searchText.length >= 2) {
        params.set('Query', this.searchText);
      }

      const response = await fetch(`${getBackendUri()}/Codifier?${params.toString()}`)
      this.items = await response.json() as ICodifier[];
    },
    resetFilters() {
      this.searchText = '';
      this.items = [];
      this.filterTo = 25;
    }
  },
  getters: {
    filteredItems(state: ICodifierStore): ICodifier[] {
      return state.items;
    }
  }
})();
