import type { ICodifier } from '@/stores/interface/ICodifier.ts'

export interface ICodifierCacheStore {
  cachedCodifiersByCode: Map<string, ICodifier>;
  cachedCodifiersByParentCode: Map<string, ICodifier[]>;
}

export interface ICodifierStore {
  items: ICodifier[];
  codifierTypeCodes: string[];
  filterTo: number;
  searchText: string;
  addChildren: boolean;
  selectedItem: ICodifier|undefined;
  storeId: string;
}
