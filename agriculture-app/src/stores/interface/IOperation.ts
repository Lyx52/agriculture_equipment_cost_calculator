import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import type { IFarmlandOperation } from '@/stores/interface/IFarmlandOperation.ts'
import type { IEquipment } from '@/stores/interface/IEquipment.ts'

export interface IOperation {
  id: string;
  farmland: IFarmland|undefined;
  operation: IFarmlandOperation|undefined;
  tractorOrCombine: IEquipment|undefined;
  machine: IEquipment|undefined;
}
