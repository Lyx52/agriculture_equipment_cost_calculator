/* eslint-disable  @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import type { IOperationStore } from '@/stores/interface/IOperationStore.ts'
import type { IOperation } from '@/stores/interface/IOperation.ts'
import { CollectionTypes } from '@/stores/enums/CollectionTypes.ts'
import emitter from '@/stores/emitter.ts'
import { OperationModel } from '@/stores/model/operationModel.ts'
import { fetchBackend, getBackendUri, groupedBy, uniqueBy } from '@/utils.ts'
import { useCodifierStore, useCodifierStoreCache } from '@/stores/codifier.ts'
import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'
import { useFarmlandStore } from '@/stores/farmland.ts'

export const useOperationStore = defineStore('operation', {
  state(): IOperationStore {
      return {
        items: [] as OperationModel[],
        filteredFarmlandId: undefined,
        filteredFarmlandOperationCode: undefined,
        isLoading: false,
      }
  },
  actions: {
    getEmitterEvent(eventType: CollectionEvents) {
      return eventType + ":" + CollectionTypes.Operation;
    },

    resetFilters(): void {
      this.filteredFarmlandId = undefined;
      this.filteredFarmlandOperationCode = undefined;
    },

    async addOperationAsync(item: IOperation) {
      this.isLoading = true;

      try {
        const res = await fetchBackend('POST', `${getBackendUri()}/FarmlandOperation/${item.user_farmland_id}/Add`, item);
        if (!res.ok) {
          console.error(res);
          emitter.emit('error', `Neizdevās pievienot lauka operāciju`);
        }

      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
      await this.fetchByFilters();
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemAdded), new OperationModel(item));
    },

    async updateOperationAsync(item: IOperation) {
      this.isLoading = true;

      try {
        const res = await fetchBackend('POST', `${getBackendUri()}/FarmlandOperation/${item.user_farmland_id}/Update/${item.id}`, item);
        if (!res.ok) {
          console.error(res);
          emitter.emit('error', `Neizdevās atjaunot lauka operāciju`);
        }

      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
      await this.fetchByFilters();
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemAdded), new OperationModel(item));
    },

    async removeOperationAsync(item: IOperation) {
      this.isLoading = true;
      try {
        const res = await fetchBackend('DELETE', `${getBackendUri()}/FarmlandOperation/${item.user_farmland_id}/Remove/${item.id}`);
        if (!res.ok) {
          console.error(res);
          emitter.emit('error', `Neizdevās noņemt lauka operāciju`);
        }
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }

      await this.fetchByFilters();
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemRemoved), item.id);
    },

    async fetchByFilters() {
      this.isLoading = true;
      try {
        const params = new URLSearchParams();
        if (this.filteredFarmlandId) {
          params.set('FarmlandId', this.filteredFarmlandId);
        }
        const response = await fetchBackend('GET', `${getBackendUri()}/FarmlandOperation/Get?${params.toString()}`);
        const items = await response.json() as IOperation[];
        this.items = items.map((i: IOperation) => new OperationModel(i));

        /**
         * Load all unique codifier definitions
         */
        const codifierCache = useCodifierStoreCache();
        const productCodes = uniqueBy(this.items, (item) => item.operation_code);
        await Promise.all(productCodes.map(code => codifierCache.addAsync(code)));

        this.items.forEach((item) => {
          const store = useCodifierStore(item.id);
          store.setSelectedByCode(item.operation_code);
        });

      } catch (e: any) {
        emitter.emit('error', e.message);
        this.items = [];
      }  finally {
        this.isLoading = false;
      }
    },
  },
  getters: {
    filteredItems(state: IOperationStore): OperationModel[] {
      let filteredItems = state.items;

      if (state.filteredFarmlandId) {
        filteredItems = filteredItems.filter(o => o.user_farmland_id == state.filteredFarmlandId);
      }
      if (state.filteredFarmlandOperationCode) {
        filteredItems = filteredItems.filter(o => o?.operation_code == state.filteredFarmlandOperationCode);
      }
      return filteredItems;
    },
    groupedByOperationCode(state: IOperationStore): Record<string, OperationModel[]> {
      return groupedBy(state.items, (item) => item?.operation_code)
    },
    filteredFarmland(state: IOperationStore): FarmlandModel|undefined {
      if (!state.filteredFarmlandId) return undefined;
      const farmlandStore = useFarmlandStore();
      return farmlandStore.getItemById(state.filteredFarmlandId);
    }
  }
})
