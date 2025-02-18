/* eslint-disable  @typescript-eslint/no-explicit-any */

import { defineStore } from 'pinia'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import { v4 as uuid } from 'uuid'
import type { IEquipmentCollectionStore } from '@/stores/interface/IEquipmentCollectionStore.ts'
import type { IEquipment } from '@/stores/interface/IEquipment.ts'
import type { IDropdownOption } from '@/stores/interface/IDropdownOption.ts'
import { EquipmentModel } from '@/stores/model/equipmentModel.ts'
import { CollectionTypes } from '@/stores/enums/CollectionTypes.ts'
import emitter from '@/stores/emitter.ts'
import { fetchBackend, getBackendUri, sum, uniqueBy } from '@/utils.ts'
import { useCodifierStore, useCodifierStoreCache } from '@/stores/codifier.ts'

export const useEquipmentCollectionStore = defineStore('equipmentCollection', {
  state(): IEquipmentCollectionStore {
      return {
        items: [],
        searchText: '',
        equipmentCategoryTypeCode: undefined,
        isLoading: false
      }
  },
  actions: {
    getEmitterEvent(eventType: CollectionEvents) {
      return eventType + ":" + CollectionTypes.Equipment;
    },
    async addEquipmentAsync(item: IEquipment) {
      const newItem: IEquipment = {
        ...item,
        expected_age: 15,
        usage_hours_per_year: 300,
        purchase_date: item.purchase_date ?? new Date()
      }
      this.isLoading = true;

      try {
        const res = await fetchBackend('POST', `${getBackendUri()}/UserEquipment/Add`, newItem);
        if (!res.ok) {
          console.error(res);
          emitter.emit('error', `Neizdevās pievienot tehnikas vienību`);
        }
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
      await this.fetchByFilters();
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemAdded), new EquipmentModel(newItem));
    },

    async updateEquipmentAsync(item: IEquipment) {
      this.isLoading = true;

      try {
        const res = await fetchBackend('POST', `${getBackendUri()}/UserEquipment/Update/${item.id}`, item);
        if (!res.ok) {
          console.error(res);
          emitter.emit('error', `Neizdevās atjaunot tehnikas vienību`);
        }
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
      await this.fetchByFilters();
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemUpdated), new EquipmentModel(item));
    },

    async removeEquipmentAsync(itemId: string) {
      this.isLoading = true;

      try {
        const res = await fetchBackend('DELETE', `${getBackendUri()}/UserEquipment/Remove/${itemId}`);
        if (!res.ok) {
          console.error(res);
          emitter.emit('error', `Neizdevās noņemt tehnikas vienību`);
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
        const response = await fetchBackend('GET', `${getBackendUri()}/UserEquipment/Get`)
        const items = await response.json() as IEquipment[];
        this.items = items.map((i: IEquipment) => new EquipmentModel(i));

        /**
         * Load all unique codifier definitions
         */
        const codifierCache = useCodifierStoreCache();
        const productCodes = uniqueBy(this.items, (item) => item.equipment_type_code);
        await Promise.all(productCodes.map(code => codifierCache.addAsync(code)));

        this.items.forEach((item) => {
          const equipmentValueCodifier = codifierCache.getByCode(item.equipment_type_code);
          if (equipmentValueCodifier) {
            item.equipment_type = {
              code: equipmentValueCodifier.code,
              name: equipmentValueCodifier.name,
              configuration: JSON.stringify(equipmentValueCodifier.value)
            };
          }
        });

      } catch (e: any) {
        emitter.emit('error', e.message);
        this.items = [];
      }  finally {
        this.isLoading = false;
      }
    },

    getItemById(itemId: string|undefined): EquipmentModel|undefined {
      const item = this.items.find(i => i.id === itemId);
      return item ? item : undefined;
    },

    getFormattedOption(value: any): IDropdownOption<any> {
      const item = this.getItemById(value);
      return {
        name: `${item?.equipment_type?.name} - ${item?.manufacturer} ${item?.model} ${this.getPowerOrWorkingWidth(item)}`,
        id: value,
        value: value,
      }
    },

    getFilteredTractorOrCombine(searchText: string): IDropdownOption<any>[] {
      return this.items
        .filter(e => `${e.manufacturer} ${e.model} ${this.getPowerOrWorkingWidth(e)}`.toLowerCase().includes(searchText.toLowerCase()) && this.isTractorOrCombine(e))
        .map(e => this.getFormattedOption(e.id));
    },
    getFilteredMachines(searchText: string): IDropdownOption<any>[] {
      return this.items
        .filter(e => `${e.manufacturer} ${e.model} ${this.getPowerOrWorkingWidth(e)}`.toLowerCase().includes(searchText.toLowerCase()) && !this.isTractorOrCombine(e))
        .map(e => this.getFormattedOption(e.id));
    },
    getPowerOrWorkingWidth(item: IEquipment|undefined) {
      if (!item) return '';
      if (item.specifications.power) return `(${item.specifications.power} kw)`;
      if (item.specifications.work_width) return `(${item.specifications.work_width} m)`;
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
    },
    equipmentTotalsByProperty(mapFunc: (model: EquipmentModel) => number): number {
      const models: EquipmentModel[] = this.items;
      return sum(models.map(mapFunc));
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
  }
})
