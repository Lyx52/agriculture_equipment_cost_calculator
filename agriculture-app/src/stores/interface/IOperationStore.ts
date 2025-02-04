import type { OperationModel } from '@/stores/model/operationModel.ts'
import type { IFarmlandOperation } from '@/stores/interface/IFarmlandOperation.ts'

export interface IOperationStore {
  items: OperationModel[];
  filteredFarmlandId: string|undefined;
  filteredFarmlandOperation: IFarmlandOperation|undefined;
}
