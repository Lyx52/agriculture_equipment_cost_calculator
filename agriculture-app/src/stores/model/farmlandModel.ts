import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import { useOperationStore } from '@/stores/operation.ts'
import type { OperationModel } from '@/stores/model/operationModel.ts'

export class FarmlandModel implements IFarmland {
  id: string;
  area: number;
  product_code: string|undefined;

  constructor(farmland: IFarmland) {
    this.id = farmland.id;
    this.area = farmland.area;
    this.product_code = farmland.product_code;
  }

  get landArea(): number {
    return Number(this.area ?? 0);
  }

  get operations(): OperationModel[] {
    const operationCollection = useOperationStore();
    console.log(operationCollection.items.filter(o => o.user_farmland_id === this.id))
    return operationCollection.items.filter(o => o.user_farmland_id === this.id);
  }
}
