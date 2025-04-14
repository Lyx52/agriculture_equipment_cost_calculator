/* eslint-disable  @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import type { ICropsStore } from '@/stores/interface/ICropsStore.ts'
import { useCodifierStore } from '@/stores/codifier.ts'
import { cropFromCodifier, CropTypeModel } from '@/stores/model/cropTypeModel.ts'
import { Codifiers } from '@/stores/enums/Codifiers.ts'
import emitter from '@/stores/emitter.ts'
import { fetchBackend, getBackendUri, sortBy, validateProblem } from '@/utils.ts'
import { CollectionEvents } from '@/stores/enums/CollectionEvents.ts'
import type { ICropType } from '@/stores/interface/ICropType.tsx'
import { v4 as uuid } from 'uuid';
import { CollectionTypes } from '@/stores/enums/CollectionTypes.ts'
import type { IDropdownOption } from '@/stores/interface/IDropdownOption.ts'

export const useCropsStore = defineStore('crops', {
  state(): ICropsStore {
      return {
        items: [] as CropTypeModel[],
        searchText: '',
        isLoading: false,
      }
  },
  actions: {
    getEmitterEvent(eventType: CollectionEvents) {
      return eventType + ":" + CollectionTypes.Crops;
    },
    async addCropTypeAsync(item: ICropType) {
      this.isLoading = true;

      try {
        const response = await fetchBackend('POST', `${getBackendUri()}/UserCropType/Add`, item);
        await validateProblem(response);
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
      await this.fetchByFilters();
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemAdded), new CropTypeModel(item));
    },

    async updateCropTypeAsync(item: ICropType) {
      this.isLoading = true;

      try {
        const response = await fetchBackend('POST', `${getBackendUri()}/UserCropType/Update/${item.id}`, item);
        await validateProblem(response);
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
      await this.fetchByFilters();
      emitter.emit(this.getEmitterEvent(CollectionEvents.ItemUpdated), new CropTypeModel(item));
    },

    async resetCropTypesAsync() {
      this.isLoading = true;
      try {
        const response = await fetchBackend('DELETE', `${getBackendUri()}/UserCropType/Remove/All`);
        await validateProblem(response);
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }

      await this.fetchByFilters();
    },
    async removeCropAsync(cropId: string) {
      this.isLoading = true;
      try {
        const response = await fetchBackend('DELETE', `${getBackendUri()}/UserCropType/Remove/${cropId}`);
        await validateProblem(response);
      } catch (e: any) {
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }

      await this.fetchByFilters();
    },

    getItemByCode(code: string): CropTypeModel | undefined {
      return this.items.find(e => e.code === code);
    },

    getItemById(id: string): CropTypeModel | undefined {
      return this.items.find(e => e.id === id);
    },

    getFormattedOption(value: any): IDropdownOption<any> {
      const item = this.getItemByCode(value) ?? this.getItemById(value);
      return {
        name: item?.name ?? '',
        id: value,
        value: value,
      }
    },

    getFilteredCropTypes(searchText: string): IDropdownOption<any>[] {
      return this.items
        .filter(e => e.name.toLowerCase().includes(searchText.toLowerCase()))
        .map(e => this.getFormattedOption(e.code));
    },

    async fetchByFilters() {
      this.isLoading = true;
      try {
        const codifierStore = useCodifierStore(uuid());
        codifierStore.$patch({
          codifierTypeCodes: [Codifiers.CropTypes],
          filterTo: 1000,
        });
        await codifierStore.fetchByFilters();

        this.items = codifierStore.items.map(c => cropFromCodifier(c));

        const response = await fetchBackend('GET', `${getBackendUri()}/UserCropType/Get`);
        const userCrops = await response.json() as ICropType[];
        const existingCropCodes = userCrops.map(c => c.code);
        this.items = this.items.filter(i => !existingCropCodes.includes(i.code));
        this.items = [
          ...this.items,
          ...userCrops.map(c => new CropTypeModel(c))
        ];
        this.items = sortBy(this.items, (item) => item.isCustom ? -1000 : Number(item.ladCode), true);
      } catch (e: any) {
        console.log(e);
        emitter.emit('error', e.message);
      }  finally {
        this.isLoading = false;
      }
    }
  },
  getters: {
    filteredItems(state: ICropsStore): CropTypeModel[] {
      return state.items
        .filter(e => e.name.toLowerCase().includes(state.searchText.toLowerCase()) || e.code.includes(state.searchText));
    }
  }
});
