import type { TinyEmitter } from 'tiny-emitter'
import type { IEquipment } from '@/stores/interface/IEquipment.ts'

export interface IEquipmentFilterStore {
  items: IEquipment[];
  emitter: TinyEmitter;
  searchText: string;
  selectedItem: IEquipment|undefined;
  filterTo: number;
  equipmentTypeCodes: string[];
}
