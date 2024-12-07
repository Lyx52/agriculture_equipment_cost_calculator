import type {PowerTrainType} from "@/stores/constants/CommonTypes";

export interface IEquipmentSpecification {
    powertrain: PowerTrainType;
    required_power_kw: number;
    engine_power_kw: number;
    weight: number;
    engine_cylinders: number;
    hydrolic_pump_flow: number;
    lift_capacity: number;
    working_width: number;
}