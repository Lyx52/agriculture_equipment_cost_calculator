import { defineStore } from 'pinia'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import { v4 as uuid } from 'uuid'
import type { IOperationStore } from '@/stores/interface/IOperationStore.ts'
import type { IOperation } from '@/stores/interface/IOperation.ts'
import { CollectionTypes } from '@/stores/enums/CollectionTypes.ts'
import emitter from '@/stores/emitter.ts'

export const useOperationStore = defineStore('operation', {
  state(): IOperationStore {
      return {
        items: [],
        filteredFarmland: undefined,
        filteredFarmlandOperation: undefined
      }
  },
  actions: {
    getEmitterEvent(eventType: CollectionEvents) {
      return eventType + ":" + CollectionTypes.Operation;
    },
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
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemAdded), newItem);
    },
    removeItem(itemId: string) {
      this.items = this.items.filter(i => i.id !== itemId);
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemRemoved), itemId);
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
