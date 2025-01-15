import type { IOperation } from '@/stores/interface/IOperation.ts'
import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import type { IFarmlandOperation } from '@/stores/interface/IFarmlandOperation.ts'

export interface IOperationStore {
  items: IOperation[];
  filteredFarmland: IFarmland|undefined;
  filteredFarmlandOperation: IFarmlandOperation|undefined;
}
