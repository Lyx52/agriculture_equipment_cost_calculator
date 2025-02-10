import { defineStore } from 'pinia'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import { v4 as uuid } from 'uuid'
import type { IOperationStore } from '@/stores/interface/IOperationStore.ts'
import type { IOperation } from '@/stores/interface/IOperation.ts'
import { CollectionTypes } from '@/stores/enums/CollectionTypes.ts'
import emitter from '@/stores/emitter.ts'
import { OperationModel } from '@/stores/model/operationModel.ts'
import { groupedBy, sum } from '@/utils.ts'
import { EquipmentModel } from '@/stores/model/equipmentModel.ts'

export const useOperationStore = defineStore('operation', {
  state(): IOperationStore {
      return {
        items: [] as OperationModel[],
        filteredFarmlandId: undefined,
        filteredFarmlandOperation: undefined
      }
  },
  actions: {
    getEmitterEvent(eventType: CollectionEvents) {
      return eventType + ":" + CollectionTypes.Operation;
    },
    resetFilters(): void {
      this.filteredFarmlandId = undefined;
      this.filteredFarmlandOperation = undefined;
    },
    pushItem(item: IOperation): void {
      if (this.items.some(e => e.id === item.id))
        return;
      const itemId = uuid();
      const newItem = new OperationModel({
        ...item,
        id: itemId
      } as IOperation);
      this.items.push(newItem);
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemAdded), newItem);
    },
    removeItem(itemId: string) {
      this.items = this.items.filter(i => i.id !== itemId);
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemRemoved), itemId);
    }
  },
  getters: {
    filteredItems(state: IOperationStore): OperationModel[] {
      let filteredItems = state.items;

      if (state.filteredFarmlandId) {
        filteredItems = filteredItems.filter(o => o.farmlandId == state.filteredFarmlandId);
      }
      if (state.filteredFarmlandOperation) {
        filteredItems = filteredItems.filter(o => o.operation?.operationCode == state.filteredFarmlandOperation?.operationCode);
      }
      return filteredItems;
    },
    groupedByOperationCode(state: IOperationStore): Record<string, OperationModel[]> {
      return groupedBy(state.items, (item) => item.operation!.operationCode!)
    }
  },
  persist: {
    serializer: {
      deserialize: (data: string) => {
        const stateData = JSON.parse(data);
        return {
          items: stateData.items.map((o: any) => new OperationModel(o)),
          filteredFarmlandId: undefined,
          filteredFarmlandOperation: undefined
        } as IOperationStore
      },
      serialize: (data) => {
        return JSON.stringify({
          items: data.items
        });
      }
    }
  }
})
