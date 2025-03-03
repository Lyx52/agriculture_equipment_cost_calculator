import type { IAdjustment } from '@/stores/interface/IAdjustment.ts'

export class AdjustmentModel implements IAdjustment {
  value: number;
  adjustment_type_code: string;
  id: string|undefined;
  name: string;
  constructor(adjustment: IAdjustment) {
    this.value = adjustment.value;
    this.adjustment_type_code = adjustment.adjustment_type_code;
    this.id = adjustment.id;
    this.name = adjustment.name;
  }
  get displayName() {
    return this.name;
  }
  get costPerHectare() {
    return this.value;
  }
}
