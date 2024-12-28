import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import type { TinyEmitter } from 'tiny-emitter'

export interface IFarmlandStore {
  items: IFarmland[];
  emitter: TinyEmitter;
  showMapModal: boolean;
}
