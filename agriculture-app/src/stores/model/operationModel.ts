import type { IOperation } from '@/stores/interface/IOperation.ts'
import type { IFarmlandOperation } from '@/stores/interface/IFarmlandOperation.ts'
import { useEquipmentCollectionStore } from '@/stores/equipmentCollection.ts'
import type { EquipmentModel } from '@/stores/model/equipmentModel.ts'
import { useFarmlandStore } from '@/stores/farmland.ts'
import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'

export class OperationModel implements IOperation {
  id: string;
  farmlandId: string|undefined;
  operation: IFarmlandOperation|undefined;
  tractorOrCombineId: string|undefined;
  machineId: string|undefined;

  constructor(operation: IOperation) {
    this.id = operation.id;
    this.farmlandId = operation.farmlandId;
    this.operation = operation.operation;
    this.tractorOrCombineId = operation.tractorOrCombineId;
    this.machineId = operation.machineId;
  }

  get machine(): EquipmentModel|undefined {
    const equipmentCollection = useEquipmentCollectionStore();
    return equipmentCollection.getItemById(this.machineId);
  }

  get tractorOrCombine(): EquipmentModel|undefined {
    const equipmentCollection = useEquipmentCollectionStore();
    return equipmentCollection.getItemById(this.tractorOrCombineId);
  }

  get farmland(): FarmlandModel|undefined {
    const farmlandCollection = useFarmlandStore();
    return farmlandCollection.getItemById(this.farmlandId);
  }
}
