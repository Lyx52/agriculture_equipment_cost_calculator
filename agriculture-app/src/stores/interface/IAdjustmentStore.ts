import type { AdjustmentModel } from '@/stores/model/adjustmentModel.ts'

export interface IAdjustmentStore {
  items: AdjustmentModel[];
  isLoading: boolean;
}
