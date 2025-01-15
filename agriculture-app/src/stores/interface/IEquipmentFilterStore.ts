import type { IEquipment } from '@/stores/interface/IEquipment.ts'

export interface IEquipmentFilterStore {
  items: IEquipment[];
  searchText: string;
  selectedItem: IEquipment|undefined;
  filterTo: number;
  equipmentTypeCodes: string[];
  powerFilter: number[];
  requiredPowerFilter: number[];
}
