import type { IIndicatorResponse } from '@/stores/interface/IIndicatorResponse.ts'
import type { IInflationBetweenResult } from '@/stores/interface/IInflationBetweenResult.ts'

export interface IIndicatorStore {
  interestRate: IIndicatorResponse;
  inflationRate: IIndicatorResponse;
  consumerPriceIndices: Record<string, number>;
  motorHoursByYear: Record<string, Record<string, number>>;
  inflationBetweenCache: Record<string, IInflationBetweenResult>;
}
