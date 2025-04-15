import type { IAdjustment } from '@/stores/interface/IAdjustment.ts'
import type { FarmlandModel } from '@/stores/model/farmlandModel.ts'
import { useFarmlandStore } from '@/stores/farmland.ts'
import { Codifiers } from '@/stores/enums/Codifiers.ts'

export class AdjustmentModel implements IAdjustment {
  value: number;
  adjustment_type_code: string;
  id: string|undefined;
  name: string;
  user_farmland_id: string|undefined;
  constructor(adjustment: IAdjustment) {
    this.value = adjustment.value;
    this.adjustment_type_code = adjustment.adjustment_type_code;
    this.id = adjustment.id;
    this.name = adjustment.name;
    this.user_farmland_id = adjustment.user_farmland_id;
  }

  get farmland(): FarmlandModel|undefined {
    const farmlandStore = useFarmlandStore();
    return farmlandStore.getItemById(this.user_farmland_id ?? '');
  }

  get displayName() {
    return this.name;
  }

  get adjustmentTypeName() {
    switch(this.adjustment_type_code) {
      case Codifiers.CustomAdjustmentsOperations: return "Ārējais pakalpojums";
      case Codifiers.EmployeeWagePerHour: return "Darbinieks";
    }
    return '';
  }

  get costPerHectare() {
    return this.value;
  }
}
