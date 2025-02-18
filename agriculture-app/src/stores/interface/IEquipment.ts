import type { IEquipmentSpecifications } from '@/stores/interface/IEquipmentSpecifications.ts'

export interface IEquipment {
  id: string;
  manufacturer: string;
  model: string;
  equipment_type_code: string;
  price: number;
  specifications: IEquipmentSpecifications;
  expected_age: number|undefined;
  usage_hours_per_year: number|undefined;
  purchase_date: Date|string|undefined;
}
