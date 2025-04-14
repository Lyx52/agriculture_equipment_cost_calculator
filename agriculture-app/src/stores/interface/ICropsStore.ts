import { CropTypeModel } from '@/stores/model/cropTypeModel.ts'

export interface ICropsStore {
  items: CropTypeModel[];
  searchText: string;
  isLoading: boolean;
}
