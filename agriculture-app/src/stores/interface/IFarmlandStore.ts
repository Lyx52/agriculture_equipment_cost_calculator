import type { FarmlandModel } from '@/stores/model/farmlandModel.ts';

export interface IFarmlandStore {
  items: FarmlandModel[];
  showMapModal: boolean;
  isLoading: boolean;
}
