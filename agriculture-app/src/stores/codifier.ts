import { defineStore } from 'pinia'
import type { ICodifierStore } from '@/stores/interface/ICodifierStore.ts'
import type { ICodifier } from '@/stores/interface/ICodifier.ts'
import { getBackendUri } from '@/utils.ts'
export const useCodifierStore = (storeId: string) => defineStore(`codifier_${storeId}`, {
  state(): ICodifierStore {
    return {
      items: [],
      codifierTypeCodes: [],
      searchText: '',
      filterTo: 25,
      selectedItem: undefined,
      storeId: storeId,
      cachedCodifiersByCode: new Map<string, ICodifier>(),
      addChildren: false
    }
  },
  actions: {
    async fetchByFilters() {
      const params = new URLSearchParams();
      params.set('ParentCodifierCode', this.codifierTypeCodes.join(','));
      params.set('FilterTo', this.filterTo.toString());
      params.set('AddChildren', this.addChildren.toString());
      if (this.searchText.length >= 2) {
        params.set('Query', this.searchText);
      }
      const response = await fetch(`${getBackendUri()}/Codifier?${params.toString()}`)
      this.items = await response.json() as ICodifier[];
    },
    resetFilters() {
      this.searchText = '';
      this.filterTo = 25;
    },
    async setSelectedByCode(code: string|undefined) {
      if (!code)
      {
        this.selectedItem = undefined;
        return;
      }
      if (this.cachedCodifiersByCode.has(code)) {
        this.selectedItem = this.cachedCodifiersByCode.get(code);
      }
      const response = await fetch(`${getBackendUri()}/Codifier/ByCode/${code}`)
      this.selectedItem = await response.json() as ICodifier|undefined;

      if (this.selectedItem) {
        this.cachedCodifiersByCode.set(code, this.selectedItem);
      }
    },
    getByCode(code: string): ICodifier|undefined {
      return this.items.find(c => c.code === code);
    }
  },
  getters: {
    filteredItems(state: ICodifierStore): ICodifier[] {
      return state.items;
    },
    allChildrenCodifiers(state: ICodifierStore): ICodifier[] {
      return state.items.flatMap(c => c.children);
    },
    toChildrenMap(state: ICodifierStore): Map<string, ICodifier> {
      return new Map(state.items.flatMap(c => c.children).map(c => [c.code, c]));
    },
    toMap(state: ICodifierStore): Map<string, ICodifier> {
      return new Map(state.items.map(c => [c.code, c]));
    }
  }
})();
