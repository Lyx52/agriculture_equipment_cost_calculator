import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import type { IFarmlandOperation } from '@/stores/interface/IFarmlandOperation.ts'

export interface IOperation {
  id: string;
  farmlandId: string|undefined;
  operation: IFarmlandOperation|undefined;
  tractorOrCombineId: string|undefined;
  machineId: string|undefined;
}
