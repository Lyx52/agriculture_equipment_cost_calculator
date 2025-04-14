/* eslint-disable  @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { Prefetch } from '@/stores/enums/Prefetch.ts'
import type { IPrefetchStore } from '@/stores/interface/IPrefetchStore.ts'
import emitter from '@/stores/emitter.ts'
import { useFarmInformationStore } from '@/stores/farmInformation.ts'
import { useAdjustmentsStore } from '@/stores/adjustments.ts'
import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
import { useCropsStore } from '@/stores/crops.ts'
import { useAgriculturalSupportCodifierStore, useOperationTypeCodifierStore } from '@/stores/codifier.ts'
import { useOperationStore } from '@/stores/operation.ts'
import { useFarmlandStore } from '@/stores/farmland.ts'
import { useIndicatorStore } from '@/stores/indicator.ts'

export const usePrefetchStore = defineStore('prefetch', {
  state(): IPrefetchStore {
    return {
      handles: new Map<Prefetch, () => Promise<void>>,
      isLoading: false,
    }
  },
  actions: {
    initialize() {
      /**
       * Prefetch for user farm information
       */
      this.addPrefetch(Prefetch.UserFarmInfo, async () => {
        const store = useFarmInformationStore();
        await store.fetchFarmInformationAsync();
      });

      /**
       * Prefetch for user adjustments
       */
      this.addPrefetch(Prefetch.UserAdjustments, async () => {
        const adjustmentStore = useAdjustmentsStore();
        await adjustmentStore.fetchByFilters();
      });

      /**
       * Prefetch for user equipment
       */
      this.addPrefetch(Prefetch.UserEquipment, async () => {
        const equipmentCollection = useEquipmentCollectionStore();
        await equipmentCollection.fetchByFilters();
      });

      /**
       * Prefetch for user operations
       */
      this.addPrefetch(Prefetch.UserOperations, async () => {
        const operationStore = useOperationStore();
        await operationStore.fetchByFilters();
      });

      /**
       * Prefetch for user crop types
       */
      this.addPrefetch(Prefetch.UserCropTypes, async () => {
        const cropTypeStore = useCropsStore();
        await cropTypeStore.fetchByFilters();
      });

      /**
       * Prefetch for user operation type codifiers
       */
      this.addPrefetch(Prefetch.UserOperationTypeCodifiers, async () => {
        const codifierStore = useOperationTypeCodifierStore();
        await codifierStore.fetchByFilters();
      });

      /**
       * Prefetch for agricultural operations
       */
      this.addPrefetch(Prefetch.UserAgriculturalOperationCodifiers, async () => {
        const codifierStore = useAgriculturalSupportCodifierStore();
        await codifierStore.fetchByFilters();
      });

      /**
       * Prefetch for user farmland
       */
      this.addPrefetch(Prefetch.UserFarmlands, async () => {
        const farmlandStore = useFarmlandStore();
        await farmlandStore.fetchByFilters();
      });

      /**
       * Prefetch for fetch all indicators
       */
      this.addPrefetch(Prefetch.FetchAllIndicators, async () => {
        const indicatorStore = useIndicatorStore();
        await Promise.all([
          indicatorStore.getInflationRate(),
          indicatorStore.getInterestRate(),
          indicatorStore.getConsumerPriceIndices(),
          indicatorStore.getMotorHoursByYear()
        ]);
      });
    },
    addPrefetch(key: Prefetch, handle: () => Promise<void>) {
      this.handles.set(key, handle);
    },
    *buildPrefetch(prefetchList: Prefetch[]): Generator<Promise<void>> {
      for (const prefetch of prefetchList) {
        if (!this.handles.has(prefetch)) {
          emitter.emit('error', `Prefetch ${prefetch} does not exist!`);
          continue;
        }

        yield this.handles.get(prefetch)!();
      }
    },
    async executePrefetch(executed: Prefetch[]) {
      this.isLoading = true;
      try {
        await Promise.all(this.buildPrefetch(executed));
      } catch (e: any) {
        emitter.emit('error', e.message);
      } finally {
        this.isLoading = false;
      }
    },
  },
  getters: {

  }
});
