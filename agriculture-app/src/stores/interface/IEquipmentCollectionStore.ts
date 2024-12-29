import type { TinyEmitter } from 'tiny-emitter'
import type { IEquipment } from '@/stores/interface/IEquipment.ts'

export interface IEquipmentCollectionStore {
  items: IEquipment[];
  emitter: TinyEmitter;
  searchText: string;
}
