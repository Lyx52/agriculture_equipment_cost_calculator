import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import type { IFarmlandOperation } from '@/stores/interface/IFarmlandOperation.ts'
import type { EquipmentModel } from '@/stores/model/equipmentModel.ts'

export interface IOperation {
  id: string;
  farmland: IFarmland|undefined;
  operation: IFarmlandOperation|undefined;
  tractorOrCombine: EquipmentModel|undefined;
  machine: EquipmentModel|undefined;
}
