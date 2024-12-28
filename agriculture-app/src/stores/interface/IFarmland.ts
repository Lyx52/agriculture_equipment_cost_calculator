import type { IDateInterval } from '@/stores/interface/IDateInterval.ts'
import type { IFarmlandProduct } from '@/stores/interface/IFarmlandProduct.ts'

export interface IFarmland {
  id: string;
  area: number;
  product: IFarmlandProduct|undefined,
  plantInterval: IDateInterval,
  harvestInterval: IDateInterval,
}
