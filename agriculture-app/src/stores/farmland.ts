/* eslint-disable  @typescript-eslint/no-explicit-any */

import { defineStore } from 'pinia'
import type { IFarmlandStore } from '@/stores/interface/IFarmlandStore.ts';
import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import { v4 as uuid } from 'uuid'
import { sum } from '@/utils.ts'
import type { IDropdownOption } from '@/stores/interface/IDropdownOption.ts'
import emitter from '@/stores/emitter.ts'
import { CollectionTypes } from '@/stores/enums/CollectionTypes.ts'
export const useFarmlandStore = defineStore('farmland', {
  state(): IFarmlandStore {
      return {
        items: [],
        showMapModal: false
      }
  },
  actions: {
    getEmitterEvent(eventType: CollectionEvents) {
      return eventType + ":" + CollectionTypes.Farmland;
    },
    pushItem(item: IFarmland) {
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
    getFormattedOption(value: any): IDropdownOption<any> {
      const field = value as IFarmland;
      return {
        name: `${field.product?.productName ?? 'Lauks'} (${field.area.toFixed(2)} ha)`,
        id: field.id,
        value: field,
      }
    },
    getFiltered(searchText: string): IDropdownOption<any>[] {
      return this.items
        .filter(f => `${f.product?.productName ?? 'Lauks'} (${f.area.toFixed(2)} ha)`.toLowerCase().includes(searchText.toLowerCase()))
        .map(f => this.getFormattedOption(f));
    }
  },
  getters: {
    totalFarmlandArea(state: IFarmlandStore) {
      return sum(state.items.map(l => l.area))
    }
  },
  persist: true
})
