import type { ICropType } from '@/stores/interface/ICropType.tsx'
import type { ICodifier } from '@/stores/interface/ICodifier.ts'
export const cropFromCodifier = (codifier: ICodifier): CropTypeModel => {
  const value = codifier.value ? JSON.parse(codifier.value) : {
    standard_yield: 1,
    standard_product_price: 100,
    standard_seed_cost: 0.25,
    code: ''
  };
  return new CropTypeModel({
    id: undefined,
    name: codifier.name,
    code: codifier.code,
    standard_yield: value.standard_yield,
    standard_product_price: value.standard_product_price,
    standard_seed_cost: value.standard_seed_cost,
    lad_code: value.code
  });
};
export class CropTypeModel implements ICropType {
  standard_yield: number|undefined;
  standard_product_price: number|undefined;
  standard_seed_cost: number|undefined;
  id: string|undefined;
  name: string;
  code: string;
  lad_code: string|undefined;

  constructor(item: ICropType) {
      this.name = item.name;
      this.code = item.code;
      this.standard_yield = item.standard_yield;
      this.standard_product_price = item.standard_product_price;
      this.standard_seed_cost = item.standard_seed_cost;
      this.lad_code = item.lad_code;
      this.id = item.id;
  }

  get cropName(): string {
    return this.name;
  }

  get ladCode(): string {
    return this.lad_code ?? this.code.split('_')[1];
  }

  /**
   * The name of the crop type
   */
  get standardYield(): number {
    return Number(this.standard_yield ?? 0);
  }

  /**
   * The standard product price for this crop type
   */
  get standardProductPrice(): number {
    return Number(this.standard_product_price ?? 0);
  }

  /**
   * The standard seed price for this crop type
   */
  get standardSeedPrice(): number {
    return Number(this.standard_seed_cost ?? 0);
  }
}
