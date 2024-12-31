import { defineStore } from 'pinia'
import { TinyEmitter } from 'tiny-emitter'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import { v4 as uuid } from 'uuid'
import type { IOperationStore } from '@/stores/interface/IOperationStore.ts'
import type { IOperation } from '@/stores/interface/IOperation.ts'

export const useOperationStore = defineStore('operation', {
  state(): IOperationStore {
      return {
        items: [],
        filteredFarmland: undefined,
        filteredFarmlandOperation: undefined,
        emitter: new TinyEmitter()
      }
  },
  actions: {
    resetFilters(): void {
      this.filteredFarmland = undefined;
    },
    pushItem(item: IOperation): void {
      if (this.items.some(e => e.id === item.id))
        return;
      const itemId = uuid();
      const newItem = {
        ...item,
        id: itemId
      }
      this.items.push(newItem);
      this.emitter.emit(CollectionEvents.ItemAdded, newItem);
    },
    removeItem(itemId: string) {
      this.items = this.items.filter(i => i.id !== itemId);
      this.emitter.emit(CollectionEvents.ItemRemoved, itemId);
    },
  },
  getters: {
    filteredItems(state: IOperationStore): IOperation[] {
      let filteredItems = state.items;

      if (state.filteredFarmland) {
        filteredItems = filteredItems.filter(o => o.farmland?.id == state.filteredFarmland?.id);
      }
      if (state.filteredFarmlandOperation) {
        filteredItems = filteredItems.filter(o => o.operation?.operationCode == state.filteredFarmlandOperation?.operationCode);
      }
      return filteredItems;
    }
  },
  persist: true
})
