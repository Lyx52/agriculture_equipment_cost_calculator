import type { IFarmland } from '@/stores/interface/IFarmland.ts'
import { useOperationStore } from '@/stores/operation.ts'
import { type OperationModel } from '@/stores/model/operationModel.ts'
import { useCodifierStoreCache } from '@/stores/codifier.ts'

export class FarmlandModel implements IFarmland {
  id: string;
  area: number;
  product_code: string|undefined;
  product_name: string|undefined;

  constructor(farmland: IFarmland) {
    this.id = farmland.id;
    this.area = farmland.area;
    this.product_code = farmland.product_code;
    this.product_name = farmland.product_name;
    if (!this.product_code) {
      const codifierCache = useCodifierStoreCache();
      this.product_name = codifierCache.getByCode(this.product_code)?.name;
    }
  }

  get landArea(): number {
    return Number(this.area ?? 0);
  }

  get operations(): OperationModel[] {
    const operationCollection = useOperationStore();
    return operationCollection.items.filter(o => o.user_farmland_id === this.id);
  }
}
