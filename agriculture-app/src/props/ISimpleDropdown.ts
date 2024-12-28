/* eslint-disable  @typescript-eslint/no-explicit-any */

import type { IDropdownOption } from '@/stores/interface/IDropdownOption.ts'

export interface ISimpleDropdownProps {
  isLoading: boolean;

  getFiltered(searchText: string): IDropdownOption<any>[];
  getFormattedOption(value: any): IDropdownOption<any>;
}
