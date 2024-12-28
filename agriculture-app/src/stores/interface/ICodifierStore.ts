import type { TinyEmitter } from 'tiny-emitter'
import type { ICodifier } from '@/stores/interface/ICodifier.ts'

export interface ICodifierStore {
  items: ICodifier[];
  emitter: TinyEmitter;
  codifierTypeCode: string;
  filterTo: number;
  searchText: string;
  selectedItem: ICodifier|undefined;
}
