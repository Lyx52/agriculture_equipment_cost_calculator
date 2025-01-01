export interface IEquipmentSpecifications {
  power: number|undefined;
  required_power: number|undefined;
  power_train_code: string|undefined;
  work_width: number|undefined;
  cultivator_type: string|undefined;
  shredder_type: string|undefined;
  self_propelled: boolean|undefined;
  repair_value_code: string;
}
