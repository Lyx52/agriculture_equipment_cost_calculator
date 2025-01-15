import type { ICodifier } from '@/stores/interface/ICodifier.ts'

export interface ICodifierStore {
  items: ICodifier[];
  codifierTypeCodes: string[];
  filterTo: number;
  searchText: string;
  addChildren: boolean;
  selectedItem: ICodifier|undefined;
  storeId: string;
  cachedCodifiersByCode: Map<string, ICodifier>;
}
