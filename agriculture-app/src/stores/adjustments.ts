/* eslint-disable  @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import emitter from '@/stores/emitter.ts'
import { fetchBackend, getBackendUri, validateProblem } from '@/utils.ts'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import { CollectionTypes } from '@/stores/enums/CollectionTypes.ts'
import type { IAdjustmentStore } from '@/stores/interface/IAdjustmentStore.ts'
import { AdjustmentModel } from '@/stores/model/adjustmentModel.ts'
import type { IAdjustment } from '@/stores/interface/IAdjustment.ts'

export const useAdjustmentsStore = defineStore('adjustments', {
  state(): IAdjustmentStore {
      return {
        items: [] as AdjustmentModel[],
        isLoading: false,
      }
  },
  actions: {
    getEmitterEvent(eventType: CollectionEvents) {
      return eventType + ":" + CollectionTypes.Adjustments;
    },
    async addAdjustmentAsync(item: IAdjustment) {
      this.isLoading = true;

      try {
        const response = await fetchBackend('POST', `${getBackendUri()}/UserAdjustment/Add`, item);
        await validateProblem(response);
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
      await this.fetchByFilters();
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemAdded), new AdjustmentModel(item));
    },

    async updateAdjustmentAsync(item: IAdjustment) {
      this.isLoading = true;

      try {
        const response = await fetchBackend('POST', `${getBackendUri()}/UserAdjustment/Update/${item.id}`, item);
        await validateProblem(response);
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
      await this.fetchByFilters();
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemUpdated), new AdjustmentModel(item));
    },

    async removeAdjustmentAsync(adjustmentId: string) {
      this.isLoading = true;
      try {
        const response = await fetchBackend('DELETE', `${getBackendUri()}/UserAdjustment/Remove/${adjustmentId}`);
        await validateProblem(response);
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }

      await this.fetchByFilters();
    },

    async fetchByFilters() {
      this.isLoading = true;
      try {
        const response = await fetchBackend('GET', `${getBackendUri()}/UserAdjustment/Get`);
        const userAdjustments = await response.json() as IAdjustment[];
        this.items = userAdjustments.map((adjustment) => new AdjustmentModel(adjustment));
      } catch (e: any) {
        console.log(e);
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
    }
  }
});
