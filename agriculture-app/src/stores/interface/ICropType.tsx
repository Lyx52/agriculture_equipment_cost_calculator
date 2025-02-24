export interface ICropType {
  id: string|undefined;
  name: string;
  code: string;
  standard_yield: number|undefined;
  standard_product_price: number|undefined;
  standard_seed_cost: number|undefined;
  standard_field_usage: number|undefined;
  lad_code: string|undefined;
  is_custom: boolean;
}
