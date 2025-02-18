import type { OperationModel } from '@/stores/model/operationModel.ts'

export interface IOperationStore {
  items: OperationModel[];
  filteredFarmlandId: string|undefined;
  filteredFarmlandOperationCode: string|undefined;
  isLoading: boolean;
}
