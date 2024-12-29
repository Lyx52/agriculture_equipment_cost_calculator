import type { IEquipmentSpecifications } from '@/stores/interface/IEquipmentSpecifications.ts'

export interface IEquipment {
  id: string;
  manufacturer: string;
  model: string;
  equipment_type_code: string;
  price: number;
  specifications: IEquipmentSpecifications;
}
