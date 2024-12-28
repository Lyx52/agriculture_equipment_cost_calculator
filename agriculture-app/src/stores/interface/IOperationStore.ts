import type { TinyEmitter } from 'tiny-emitter'
import type { IOperation } from '@/stores/interface/IOperation.ts'
import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import type { IFarmlandOperation } from '@/stores/interface/IFarmlandOperation.ts'

export interface IOperationStore {
  items: IOperation[];
  emitter: TinyEmitter;
  filteredFarmland: IFarmland|undefined;
  filteredFarmlandOperation: IFarmlandOperation|undefined;
}
