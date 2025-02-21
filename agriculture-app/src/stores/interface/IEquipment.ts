import type { IEquipmentSpecifications } from '@/stores/interface/IEquipmentSpecifications.ts'
import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'

export interface IEquipment {
  id: string;
  manufacturer: string;
  model: string;
  equipment_type_code: string;
  price: number;
  specifications: IEquipmentSpecifications;
  usage: IEquipmentUsage;
  purchase_date: Date|string|undefined;
}
