/* eslint-disable  @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import emitter from '@/stores/emitter.ts'
import { fetchBackend, getBackendUri, sumBy, validateProblem } from '@/utils.ts'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import { CollectionTypes } from '@/stores/enums/CollectionTypes.ts'
import type { IAdjustmentStore } from '@/stores/interface/IAdjustmentStore.ts'
import { AdjustmentModel } from '@/stores/model/adjustmentModel.ts'
import type { IAdjustment } from '@/stores/interface/IAdjustment.ts'
import { Codifiers } from '@/stores/enums/Codifiers.ts'
import type { IDropdownOption } from '@/stores/interface/IDropdownOption.ts'

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
    },
    getItemById(id: string): AdjustmentModel | undefined {
      return this.items.find(e => e.id === id);
    },

    getItemByFarmlandIdAndCode(userFarmlandId: string, typeCode: string): AdjustmentModel[] {
      return this.items.filter(e => e.user_farmland_id === userFarmlandId && e.adjustment_type_code === typeCode);
    },

    getItemByFarmlandIdAndCodes(userFarmlandId: string, typeCodes: string[]): AdjustmentModel[] {
      return this.items.filter(e => e.user_farmland_id === userFarmlandId && typeCodes.includes(e.adjustment_type_code));
    },

    getFormattedOptionWithType(value: any): IDropdownOption<any> {
      const item = this.getItemById(value);
      const displayName = item ? `${item.displayName} (${item.adjustmentTypeName})` : '';
      return {
        name: displayName,
        id: value,
        value: value,
      }
    },

    getFormattedOption(value: any): IDropdownOption<any> {
      const item = this.getItemById(value);
      return {
        name: item?.displayName ?? '',
        id: value,
        value: value,
      }
    },

    getFilteredEmployees(searchText: string): IDropdownOption<any>[] {
      return this.employees
        .filter(f => f.displayName.toLowerCase().includes(searchText.toLowerCase()))
        .map(f => this.getFormattedOption(f.id));
    },

    getFilteredExternalServices(searchText: string): IDropdownOption<any>[] {
      return this.customOperationAdjustments
        .filter(f => f.displayName.toLowerCase().includes(searchText.toLowerCase()))
        .map(f => this.getFormattedOption(f.id));
    },
    getFilteredEmployeesAndExternalServices(searchText: string): IDropdownOption<any>[] {
      return this.employeesAndCustomOperationAdjustments
        .filter(f => f.displayName.toLowerCase().includes(searchText.toLowerCase()))
        .map(f => this.getFormattedOptionWithType(f.id));
    }
  },
  getters: {
    customMaterialAdjustments(store: IAdjustmentStore): AdjustmentModel[] {
      return store.items.filter((e) => e.adjustment_type_code === Codifiers.CustomAdjustmentsMaterials);
    },
    customOperationAdjustments(store: IAdjustmentStore): AdjustmentModel[] {
      return store.items.filter((e) => e.adjustment_type_code === Codifiers.CustomAdjustmentsOperations);
    },
    employees(store: IAdjustmentStore): AdjustmentModel[] {
      return store.items.filter((e) => e.adjustment_type_code === Codifiers.EmployeeWagePerHour);
    },
    employeesAndCustomOperationAdjustments(store: IAdjustmentStore): AdjustmentModel[] {
      return store.items
        .filter((e) => [Codifiers.EmployeeWagePerHour, Codifiers.CustomAdjustmentsOperations].includes(e.adjustment_type_code as Codifiers));
    },
    totalCostsPerHectare(store: IAdjustmentStore): number {
      const filteredAdjustments = store.items
        .filter((e) => e.adjustment_type_code === Codifiers.CustomAdjustmentsMaterials);
      return sumBy(filteredAdjustments, (e) => e.costPerHectare);
    }
  }
});
