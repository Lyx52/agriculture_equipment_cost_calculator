import type { IIndicatorResponse } from '@/stores/interface/IIndicatorResponse.ts'

export interface IIndicatorStore {
  interestRate: IIndicatorResponse;
  inflationRate: IIndicatorResponse;
}
