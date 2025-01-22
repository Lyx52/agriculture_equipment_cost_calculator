import type { EquipmentModel } from '@/stores/model/equipmentModel.ts'

export interface IEquipmentCollectionStore {
  items: EquipmentModel[];
  searchText: string;
  equipmentCategoryTypeCode: string|undefined;
}
