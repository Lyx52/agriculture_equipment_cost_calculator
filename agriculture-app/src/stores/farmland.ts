/* eslint-disable  @typescript-eslint/no-explicit-any */

import { defineStore } from 'pinia'
import type { IFarmlandStore } from '@/stores/interface/IFarmlandStore.ts';
import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import { v4 as uuid } from 'uuid'
import { fetchBackend, getBackendUri, sum, uniqueBy } from '@/utils.ts'
import type { IDropdownOption } from '@/stores/interface/IDropdownOption.ts'
import emitter from '@/stores/emitter.ts'
import { CollectionTypes } from '@/stores/enums/CollectionTypes.ts'
import { FarmlandModel } from '@/stores/model/farmlandModel.ts'
import { useCodifierStore, useCodifierStoreCache } from '@/stores/codifier.ts'
export const useFarmlandStore = defineStore('farmland', {
  state(): IFarmlandStore {
      return {
        items: [] as FarmlandModel[],
        showMapModal: false,
        isLoading: false
      }
  },
  actions: {
    getEmitterEvent(eventType: CollectionEvents) {
      return eventType + ":" + CollectionTypes.Farmland;
    },
    async addFarmlandAsync(item: IFarmland) {
      this.isLoading = true;

      try {
        const res = await fetchBackend('POST', `${getBackendUri()}/UserFarmland/Add`, item);
        if (!res.ok) {
          console.error(res);
          emitter.emit('error', `Neizdevās pievienot lauku`);
        }

      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
      await this.fetchByFilters();
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemAdded), new FarmlandModel(item));
    },

    async updateFarmlandAsync(item: IFarmland) {
      this.isLoading = true;

      try {
        const res = await fetchBackend('POST', `${getBackendUri()}/UserFarmland/Update/${item.id}`, item);
        if (!res.ok) {
          console.error(res);
          emitter.emit('error', `Neizdevās atjaunot lauku`);
        }

      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
      await this.fetchByFilters();
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemAdded), new FarmlandModel(item));
    },

    async removeFarmlandAsync(itemId: string) {
      this.isLoading = true;
      try {
        const res = await fetchBackend('DELETE', `${getBackendUri()}/UserFarmland/Remove/${itemId}`);
        if (!res.ok) {
          console.error(res);
          emitter.emit('error', `Neizdevās noņemt lauku`);
        }
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }

      await this.fetchByFilters();
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemRemoved), itemId);
    },

    async fetchByFilters() {
      this.isLoading = true;
      try {
        const response = await fetchBackend('GET', `${getBackendUri()}/UserFarmland/Get`)
        const items = await response.json() as IFarmland[];
        this.items = items.map((i: IFarmland) => new FarmlandModel(i));

        /**
         * Load all unique codifier definitions
         */
        const codifierCache = useCodifierStoreCache();
        const productCodes = uniqueBy(this.items, (item) => item.product_code);
        await Promise.all(productCodes.map(code => codifierCache.addAsync(code)));

        this.items.forEach((item) => {
          const store = useCodifierStore(item.id);
          store.setSelectedByCode(item.product_code);
          item.product_name = codifierCache.getByCode(item.product_code)?.name;
        });

      } catch (e: any) {
        emitter.emit('error', e.message);
        this.items = [];
      }  finally {
        this.isLoading = false;
      }
    },

    getItemById(itemId: string|undefined): FarmlandModel|undefined {
      const item = this.items.find(i => i.id === itemId);
      return item ? item : undefined;
    },

    getFormattedOption(value: any): IDropdownOption<any> {
      const item = this.getItemById(value);
      return {
        name: `${item?.product_name ?? 'Lauks'} (${(item?.area ?? 0).toFixed(2)} ha)`,
        id: value,
        value: value,
      }
    },

    getFiltered(searchText: string): IDropdownOption<any>[] {
      return this.items
        .filter(f => `${f?.product_name ?? 'Lauks'} (${(f?.area ?? 0).toFixed(2)} ha)`.toLowerCase().includes(searchText.toLowerCase()))
        .map(f => this.getFormattedOption(f.id));
    }
  },
  getters: {
    totalFarmlandArea(state: IFarmlandStore) {
      return sum(state.items.map(l => l.area));
    }
  }
})
