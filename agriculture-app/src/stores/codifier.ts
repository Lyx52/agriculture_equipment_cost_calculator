import { defineStore } from 'pinia'
import type { ICodifierCacheStore, ICodifierStore } from '@/stores/interface/ICodifierStore.ts'
import type { ICodifier } from '@/stores/interface/ICodifier.ts'
import { getBackendUri } from '@/utils.ts'
import { Codifiers } from '@/stores/enums/Codifiers.ts'
export const useCodifierStoreCache = () => defineStore('codifier_store_cache', {
  state(): ICodifierCacheStore {
    return {
      cachedCodifiersByCode: new Map<string, ICodifier>(),
      cachedCodifiersByParentCode: new Map<string, ICodifier[]>()
    } as ICodifierCacheStore;
  },
  actions: {
    clearCache() {
      this.cachedCodifiersByCode.clear();
    },

    async addAsync(code: string) {
      if (this.cachedCodifiersByCode.has(code)) return;
      const response = await fetch(`${getBackendUri()}/Codifier/ByCode/${code}`)
      const value = await response.json() as ICodifier|undefined;
      if (value) {
        this.cachedCodifiersByCode.set(code, value);
        if (!value.parent_code) return;
        const byParent = this.cachedCodifiersByParentCode.get(value.parent_code) ?? [];
        byParent.push(value);
        this.cachedCodifiersByParentCode.set(value.parent_code, byParent);
      }
    },
    getByCode(code: string|undefined): ICodifier|undefined {
      if (!code) return undefined;
      return this.cachedCodifiersByCode.get(code);
    },
    setByCode(code: string, codifier: ICodifier) {
      this.cachedCodifiersByCode.set(code, codifier);
    },
    getByParentCode(parentCode: string): ICodifier[] {
      return this.cachedCodifiersByParentCode.get(parentCode) ?? [];
    }
  }
})();
export const useCodifierStore = (storeId: string) => defineStore(`codifier_${storeId}`, {
  state(): ICodifierStore {
    return {
      items: [],
      codifierTypeCodes: [],
      searchText: '',
      filterTo: 25,
      selectedItem: undefined,
      storeId: storeId,
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
      const codifierCacheStore = useCodifierStoreCache();
      const existing = codifierCacheStore.getByCode(code);
      if (existing) {
        this.selectedItem = existing;
        return;
      }
      const response = await fetch(`${getBackendUri()}/Codifier/ByCode/${code}`)
      this.selectedItem = await response.json() as ICodifier|undefined;

      if (this.selectedItem) {
        codifierCacheStore.setByCode(code, this.selectedItem);
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

export const useAgriculturalSupportCodifierStore = () => {
  const codifierStore = useCodifierStore(Codifiers.CustomAgriculturalSupport);
  codifierStore.$patch({
    codifierTypeCodes: [Codifiers.CustomAgriculturalSupport]
  })

  return codifierStore;
}
