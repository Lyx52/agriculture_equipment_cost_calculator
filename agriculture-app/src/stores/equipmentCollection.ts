/* eslint-disable  @typescript-eslint/no-explicit-any */

import { defineStore } from 'pinia'
import { TinyEmitter } from 'tiny-emitter'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import { v4 as uuid } from 'uuid'
import type { IEquipmentCollectionStore } from '@/stores/interface/IEquipmentCollectionStore.ts'
import type { IEquipment } from '@/stores/interface/IEquipment.ts'
import type { IDropdownOption } from '@/stores/interface/IDropdownOption.ts'
import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'
import { EquipmentModel } from '@/stores/model/equipmentModel.ts'

export const useEquipmentCollectionStore = defineStore('equipmentCollection', {
  state(): IEquipmentCollectionStore {
      return {
        items: [],
        emitter: new TinyEmitter(),
        searchText: '',
        equipmentCategoryTypeCode: undefined
      }
  },
  actions: {
    pushItem(item: IEquipment): void {
      if (this.items.some(e => e.id === item.id))
        return;
      const itemId = uuid();
      const newItem: IEquipment = {
        ...item,
        id: itemId,
        usage: {
          currentAge: 0,
          expectedAge: 15,
          hoursPerYear: 300,
        } as IEquipmentUsage
      }
      this.items.push(newItem);
      this.emitter.emit(CollectionEvents.ItemAdded, newItem);
    },
    removeItem(itemId: string) {
      this.items = this.items.filter(i => i.id !== itemId);
      this.emitter.emit(CollectionEvents.ItemRemoved, itemId);
    },
    getFormattedOption(value: any): IDropdownOption<any> {
      const field = value as IEquipment;
      return {
        name: `${value.equipment_type?.name} - ${value.manufacturer} ${value.model} ${this.getPowerOrRequiredPower(value)}`,
        id: field.id,
        value: field,
      }
    },
    getFilteredTractorOrCombine(searchText: string): IDropdownOption<any>[] {
      return this.items
        .filter(e => `${e.manufacturer} ${e.model} ${this.getPowerOrRequiredPower(e)}`.toLowerCase().includes(searchText.toLowerCase()) && this.isTractorOrCombine(e))
        .map(e => this.getFormattedOption(e));
    },
    getFilteredMachines(searchText: string): IDropdownOption<any>[] {
      return this.items
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
    filteredItems(state: IEquipmentCollectionStore): IEquipment[] {
      let items = state.items;
      if (state.equipmentCategoryTypeCode) {
        items = items.filter(e => e.equipment_type_code === state.equipmentCategoryTypeCode);
      }
      return items;
    },
    models(state: IEquipmentCollectionStore): EquipmentModel[] {
      return state.items.map(e => new EquipmentModel(e));
    }
  },
  persist: true
})
