import type { IEquipmentSpecifications } from '@/stores/interface/IEquipmentSpecifications.ts'
import type { IEquipmentType } from '@/stores/interface/IEquipmentType.ts'
import type { IEquipmentUsage } from '@/stores/interface/IEquipmentUsage.ts'

export interface IEquipment {
  id: string;
  manufacturer: string;
  model: string;
  equipment_type_code: string;
  equipment_type: IEquipmentType|undefined;
  price: number;
  specifications: IEquipmentSpecifications;
  usage: IEquipmentUsage|undefined;
  purchaseDate: Date|undefined;
}
