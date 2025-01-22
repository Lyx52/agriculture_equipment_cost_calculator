/* eslint-disable  @typescript-eslint/no-explicit-any */

import { defineStore } from 'pinia'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import { v4 as uuid } from 'uuid'
import type { IEquipmentCollectionStore } from '@/stores/interface/IEquipmentCollectionStore.ts'
import type { IEquipment } from '@/stores/interface/IEquipment.ts'
import type { IDropdownOption } from '@/stores/interface/IDropdownOption.ts'
import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'
import { EquipmentModel } from '@/stores/model/equipmentModel.ts'
import { CollectionTypes } from '@/stores/enums/CollectionTypes.ts'
import emitter from '@/stores/emitter.ts'

export const useEquipmentCollectionStore = defineStore('equipmentCollection', {
  state(): IEquipmentCollectionStore {
      return {
        items: [],
        searchText: '',
        equipmentCategoryTypeCode: undefined
      }
  },
  actions: {
    getEmitterEvent(eventType: CollectionEvents) {
      return eventType + ":" + CollectionTypes.Equipment;
    },
    pushItem(item: IEquipment): void {
      if (this.items.some(e => e.id === item.id))
        return;
      const itemId = uuid();
      const newItem: IEquipment = {
        ...item,
        id: itemId,
        usage: {
          expectedAge: 15,
          hoursPerYear: 300,
        } as IEquipmentUsage
      }
      const itemModel = new EquipmentModel(newItem);
      this.items.push(itemModel);
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemAdded), itemModel);
    },
    removeItem(itemId: string) {
      this.items = this.items.filter(i => i.id !== itemId);
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemRemoved), itemId);
    },
    getItemById(itemId: string|undefined) {
      if (itemId) return this.items.find(i => i.id === itemId);
      return undefined;
    },
    getFormattedOption(value: any): IDropdownOption<any> {
      return {
        name: `${value.equipment_type?.name} - ${value.manufacturer} ${value.model} ${this.getPowerOrRequiredPower(value)}`,
        id: value.id,
        value: value,
      }
    },
    getFilteredTractorOrCombine(searchText: string): IDropdownOption<any>[] {
      return this.models
        .filter(e => `${e.manufacturer} ${e.model} ${this.getPowerOrRequiredPower(e)}`.toLowerCase().includes(searchText.toLowerCase()) && this.isTractorOrCombine(e))
        .map(e => this.getFormattedOption(e));
    },
    getFilteredMachines(searchText: string): IDropdownOption<any>[] {
      return this.models
        .filter(e => `${e.manufacturer} ${e.model} ${this.getPowerOrRequiredPower(e)}`.toLowerCase().includes(searchText.toLowerCase()) && !this.isTractorOrCombine(e))
        .map(e => this.getFormattedOption(e));
    },
    getPowerOrRequiredPower(item: IEquipment) {
      if (item.specifications.power) return `${item.specifications.power} kw`;
      if (item.specifications.required_power) return `${item.specifications.required_power} kw`;
      return '';
    },
    isTractorOrCombine(item: IEquipment) {
      return [
        'traktors_4x4',
        'traktors_4x2',
        'traktors_kezu',
        'kartupelu_novaksanas_kombains',
        'darzenu_novaksanas_kombains',
        'graudaugu_kombains',
        'ogu_novaksans_kombains'
      ].includes(item.equipment_type_code);
    }
  },
  getters: {
    filteredItems(state: IEquipmentCollectionStore): EquipmentModel[] {
      let items = state.items;
      if (state.equipmentCategoryTypeCode) {
        items = items.filter(e => e.equipment_type_code === state.equipmentCategoryTypeCode);
      }
      return items;
    },
    models(state: IEquipmentCollectionStore): EquipmentModel[] {
      console.log(state)
      return state.items.map(e => new EquipmentModel(e));
    }
  },
  persist: {
    serializer: {
      deserialize: (data: string) => {
        const stateData = JSON.parse(data);
        return {
          items: stateData.items.map((item: any) => new EquipmentModel(item)),
          searchText: ''
        } as IEquipmentCollectionStore
      },
      serialize: (data) => {
        return JSON.stringify({
          items: data.items
        });
      }
    }
  },
})
