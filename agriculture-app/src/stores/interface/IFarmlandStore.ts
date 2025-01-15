import type { IFarmland } from '@/stores/interface/IFarmland.ts'

export interface IFarmlandStore {
  items: IFarmland[];
  showMapModal: boolean;
}
