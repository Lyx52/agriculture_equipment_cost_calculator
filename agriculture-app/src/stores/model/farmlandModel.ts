import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import type { IDateInterval } from '@/stores/interface/IDateInterval.ts'
import type { IFarmlandProduct } from '@/stores/interface/IFarmlandProduct.ts'
import { useOperationStore } from '@/stores/operation.ts'
import type { OperationModel } from '@/stores/model/operationModel.ts'

export class FarmlandModel implements IFarmland {
  id: string;
  area: number;
  product: IFarmlandProduct|undefined;
  plantInterval: IDateInterval;
  harvestInterval: IDateInterval;

  constructor(farmland: IFarmland) {
    this.id = farmland.id;
    this.area = farmland.area;
    this.product = farmland.product;
    this.plantInterval = farmland.plantInterval;
    this.harvestInterval = farmland.harvestInterval;
  }

  get landArea(): number {
    return Number(this.area ?? 0);
  }

  get operations(): OperationModel[] {
    const operationCollection = useOperationStore();
    console.log(operationCollection.items.filter(o => o.farmlandId === this.id))
    return operationCollection.items.filter(o => o.farmlandId === this.id);
  }
}
