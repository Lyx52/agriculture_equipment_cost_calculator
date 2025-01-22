import type { MachineTypeCode } from '@/utils.ts'

export interface IEquipmentConstantConfiguration {
  remaining_value_code: MachineTypeCode;
  field_efficiency: number|undefined;
  average_speed: number|undefined;
}
