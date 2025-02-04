import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import type { IDateInterval } from '@/stores/interface/IDateInterval.ts'
import type { IFarmlandProduct } from '@/stores/interface/IFarmlandProduct.ts'

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
}
