import type { IEquipment } from '@/stores/interface/IEquipment.ts'

export interface IEquipmentCollectionStore {
  items: IEquipment[];
  searchText: string;
  equipmentCategoryTypeCode: string|undefined;
}
