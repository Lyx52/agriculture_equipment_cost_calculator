import type { IEquipmentConstantConfiguration } from '@/stores/interface/IEquipmentConstantConfiguration.ts'

export interface IEquipmentType {
  code: string;
  name: string;
  configuration: IEquipmentConstantConfiguration;
}
