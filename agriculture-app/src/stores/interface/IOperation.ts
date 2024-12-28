import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import type { IFarmlandOperation } from '@/stores/interface/IFarmlandOperation.ts'

export interface IOperation {
  id: string;
  farmland: IFarmland|undefined;
  operation: IFarmlandOperation|undefined;
}
