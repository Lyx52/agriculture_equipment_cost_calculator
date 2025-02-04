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
import { FarmlandModel } from '@/stores/model/farmlandModel.ts'
export const useFarmlandStore = defineStore('farmland', {
  state(): IFarmlandStore {
      return {
        items: [] as FarmlandModel[],
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
      const newItem = new FarmlandModel({
        ...item,
        id: itemId
      } as IFarmland);
      this.items.push(newItem);
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemAdded), newItem);
    },

    removeItem(itemId: string) {
      this.items = this.items.filter(i => i.id !== itemId);
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemRemoved), itemId);
    },

    getItemById(itemId: string|undefined): FarmlandModel|undefined {
      const item = this.items.find(i => i.id !== itemId);
      return item || undefined;
    },

    getFormattedOption(value: any): IDropdownOption<any> {
      console.log(value)
      const item = this.getItemById(value);
      return {
        name: `${item?.product?.productName ?? 'Lauks'} (${(item?.area ?? 0).toFixed(2)} ha)`,
        id: value,
        value: value,
      }
    },

    getFiltered(searchText: string): IDropdownOption<any>[] {
      console.log(searchText)
      return this.items
        .filter(f => `${f?.product?.productName ?? 'Lauks'} (${(f?.area ?? 0).toFixed(2)} ha)`.toLowerCase().includes(searchText.toLowerCase()))
        .map(f => this.getFormattedOption(f.id));
    }
  },
  getters: {
    totalFarmlandArea(state: IFarmlandStore) {
      return sum(state.items.map(l => l.area));
    }
  },
  persist: {
    serializer: {
      deserialize: (data: string) => {
        const stateData = JSON.parse(data);
        return {
          items: stateData.items.map((o: any) => new FarmlandModel(o)),
          showMapModal: false
        } as IFarmlandStore
      },
      serialize: (data) => {
        return JSON.stringify({
          items: data.items
        });
      }
    }
  }
})
