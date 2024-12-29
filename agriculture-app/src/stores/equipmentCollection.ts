import { defineStore } from 'pinia'
import { TinyEmitter } from 'tiny-emitter'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import { v4 as uuid } from 'uuid'
import type { IEquipmentCollectionStore } from '@/stores/interface/IEquipmentCollectionStore.ts'
import type { IEquipment } from '@/stores/interface/IEquipment.ts'

export const useEquipmentCollectionStore = defineStore('equipmentCollection', {
  state(): IEquipmentCollectionStore {
      return {
        items: [],
        emitter: new TinyEmitter(),
        searchText: ''
      }
  },
  actions: {
    pushItem(item: IEquipment): void {
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
    filteredItems(state: IEquipmentCollectionStore): IEquipment[] {
      return state.items;
    }
  }
})
