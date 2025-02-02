import type { IIndicatorResponse } from '@/stores/interface/IIndicatorResponse.ts'

export interface IIndicatorStore {
  interestRate: IIndicatorResponse;
  inflationRate: IIndicatorResponse;
  consumerPriceIndices: Record<string, number>;
  motorHoursByYear: Record<string, Record<string, number>>;
}
