/* eslint-disable  @typescript-eslint/no-explicit-any */

import { defineStore } from 'pinia'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import type { IEquipmentCollectionStore } from '@/stores/interface/IEquipmentCollectionStore.ts'
import type { IEquipment } from '@/stores/interface/IEquipment.ts'
import type { IDropdownOption } from '@/stores/interface/IDropdownOption.ts'
import { EquipmentModel } from '@/stores/model/equipmentModel.ts'
import { CollectionTypes } from '@/stores/enums/CollectionTypes.ts'
import emitter from '@/stores/emitter.ts'
import { fetchBackend, getBackendUri, sum, uniqueBy } from '@/utils.ts'
import { useCodifierStoreCache } from '@/stores/codifier.ts'
import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'

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
        usage: {
          expected_age: 15,
          hours_per_year: 300,
          hours_per_individual_years: [],
          use_hours_per_individual_years: false
        } as IEquipmentUsage,
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
              configuration: equipmentValueCodifier?.value ? JSON.parse(equipmentValueCodifier!.value) : undefined
            };
          }
          if (!item.usage) {
            item.usage = {
              expected_age: 15,
              hours_per_year: 300,
              hours_per_individual_years: {} as Record<string, number>,
              use_hours_per_individual_years: false
            } as IEquipmentUsage;
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
        name: item?.displayName ?? '',
        id: value,
        value: value,
      }
    },

    getFilteredTractorOrSelfPropelledOrCombine(searchText: string): IDropdownOption<any>[] {
      return this.items
        .filter(e => e.displayName.toLowerCase().includes(searchText.toLowerCase()) && (e.isTractor || e.isSelfPropelled || e.isCombine))
        .map(e => this.getFormattedOption(e.id));
    },

    getFilteredMachines(searchText: string): IDropdownOption<any>[] {
      return this.items
        .filter(e => e.displayName.toLowerCase().includes(searchText.toLowerCase()) && e.isMachine)
        .map(e => this.getFormattedOption(e.id));
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
