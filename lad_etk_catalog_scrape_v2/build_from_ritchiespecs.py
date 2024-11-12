from equipment_model import EquipmentModelMetadata, EquipmentModel, EquipmentLevelCode, EquipmentCategory
from utils import open_json, save_json, clean_key, clean_value, convert_zs_to_kw
import os, re
common_keys_convert = {
    'operational_operating_weight': EquipmentModelMetadata.Weight.value[0],
    'dimensions_wheelbase': EquipmentModelMetadata.Wheelbase.value[0],
    'dimensions_overall_width': EquipmentModelMetadata.WorkingWidth.value[0],
    'engine_pto_power': EquipmentModelMetadata.PtoPowerKw.value[0],
    'engine_pto': EquipmentModelMetadata.PtoPowerKw.value[0],
    'engine_displacement': EquipmentModelMetadata.EngineDisplacement.value[0],
    'engine_number_of_cylinders': EquipmentModelMetadata.EngineCylinders.value[0],
    'dimensions_overall_length': EquipmentModelMetadata.Length.value[0],
    'operational_fuel_capacity': EquipmentModelMetadata.FuelCapacity.value[0],
    'hydraulic_system_pump_flow_capacity': EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0],
    'hydraulic_main_pump_flow_standard': EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0],
    'hydraulic_main_pump_flow_optional': EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0],
    'engine_gross_power': EquipmentModelMetadata.EnginePowerKw.value[0],
    'engine_max_horsepower': EquipmentModelMetadata.EnginePowerKw.value[0],
    'engine_power': EquipmentModelMetadata.EnginePowerKw.value[0],
    'engine_max_torque': EquipmentModelMetadata.EngineTorque.value[0],
    'transmission_max_speed': EquipmentModelMetadata.MaxSpeed.value[0],
    'speeds_maximum_road_speed': EquipmentModelMetadata.MaxSpeed.value[0],
    'operational_3_point_hitch_lift_capacity_@_24_inches': EquipmentModelMetadata.LiftCapacity.value[0],
    'engine_fuel_tank': EquipmentModelMetadata.FuelCapacity.value[0],
    'powertrain': EquipmentModelMetadata.Powertrain.value[0],
    'hydraulic_system_implement_pump_flow_ps': EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0],
    'engine_rated_power': EquipmentModelMetadata.EnginePowerKw.value[0],
    'engine_gross_engine_horsepower': EquipmentModelMetadata.EnginePowerKw.value[0],
    'weights_weight': EquipmentModelMetadata.Weight.value[0],
    '3point_hitch_lift_capacity_@_24”': EquipmentModelMetadata.LiftCapacity.value[0],
    '3point_hitch_front_hitch_lift_capacity_at_24”': EquipmentModelMetadata.LiftCapacity.value[0],
    'dimensions_wheelbase_2wd': EquipmentModelMetadata.Wheelbase.value[0],
    'dimensions_wheelbase_4wd': EquipmentModelMetadata.Wheelbase.value[0],
    'speeds_maximum_field_speed': EquipmentModelMetadata.MaxFieldSpeed.value[0],
    'dimensions_operating_speed': EquipmentModelMetadata.MaxFieldSpeed.value[0],
    'dimensions_working_width_spacing_#1_max': EquipmentModelMetadata.WorkingWidth.value[0],
    'dimensions_working_width_spacing_#2_max': EquipmentModelMetadata.WorkingWidth.value[0],
    'dimensions_working_width_spacing_#1_min': EquipmentModelMetadata.WorkingWidthMin.value[0],
    'dimensions_working_width_spacing_#2_min': EquipmentModelMetadata.WorkingWidthMin.value[0],
    'blade_disk_blade_diameter': EquipmentModelMetadata.DiscDiameter.value[0],
    'disc_system_blade_diameter': EquipmentModelMetadata.DiscDiameter.value[0],
    'configuration_working_width': EquipmentModelMetadata.WorkingWidth.value[0],
    'frame_working_width': EquipmentModelMetadata.WorkingWidth.value[0],
    'boom_max_boom_width': EquipmentModelMetadata.WorkingWidth.value[0],
    'operational_solution_tank_capacity': EquipmentModelMetadata.WorkCapacityL.value[0],
    'frame_min_working_width': EquipmentModelMetadata.WorkingWidthMin.value[0],
    'frame_max_working_width': EquipmentModelMetadata.WorkingWidth.value[0],
    'capacities_fuel_tank_capacity': EquipmentModelMetadata.FuelCapacity.value[0],
    'frame_main_frame_width': EquipmentModelMetadata.WorkingWidthMin.value[0],
    'engine_maximum_torque': EquipmentModelMetadata.EngineTorque.value[0],
    'dimensions_lift_capacity_to_full_height': EquipmentModelMetadata.LiftCapacity.value[0]
}
skip_list = [
    'dimensions_height_with_rops', 
    'dimensions_height_with_out_rops',
    'engine_engine_make', 
    'engine_power_measured_@',
    'engine_aspiration',
    'transmission_transmission_type',
    'transmission_number_of_forward_gears',
    'transmission_number_of_reverse_gears',
    'hydraulic_system_number_of_remote_control_valves',
    'operational_turning_radius',
    'engine_engine_model',
    'operational_operating_voltage',
    'operational_alternator_supplied_amperage',
    'hydraulic_system_relief_valve_setting',
    'engine_torque_measured_@',
    'operational_tire_size_front_2wd_4wd',
    'operational_rear_tires_size_2wd_4wd',
    'dimensions_ground_clearance',
    'operational_engine_oil_capacity',
    'operational_cooling_system_fluid_capacity',
    'operational_hydraulic_system_fluid_capacity',
    'operational_fuel_usage_@_75prc_load_full_rpm',
    'engine_net_power',
    'engine_engine_type',
    'engine_rated_speed',
    'engine_bore',
    'engine_stroke',
    'operational_3_point_hitch_type',
    'operational_lift_configuration',
    'transmission_brakes',
    'transmission_steering',
    'transmission_clutch_wet_dry',
    'hydraulic_system_system_pressure',
    'dimensions_front_tread_range',
    'dimensions_rear_tread_range',
    'engine_air_cleaner',
    'engine_alternator',
    'power_takeoffpto_pto_speed',
    'power_takeoffpto_power_takeoffpto_type',
    'transmission_shuttle_forwardreverse',
    'transmission_brake_type',
    'transmission_clutch_disk_diameter_wet_clutch',
    'transmission_differential_lock',
    'tires_standard_option_front',
    'tires_standard_option_rear',
    'hydraulic_system_controls',
    'engine_model_name',
    'engine_battery',
    'engine_crankcase_capacity',
    'dimensions_overall_height',
    'engine_emissions',
    'transmission_standard',
    'hydraulic_rear_remotes_base',
    'hydraulic_rear_remotes_optional',
    'hydraulic_steering_and_services_pump_standard',
    'hydraulic_steering_and_services_pump_optional',
    'dimensions_overall_height_cab_roof',
    'dimensions_overall_height_top_of_rops',
    'dimensions_overall_length_2wd',
    'dimensions_overall_length_4wd',
    'dimensions_weight_cab_2wd',
    'dimensions_weight_cab_4wd',
    'dimensions_weight_rops_2wd',
    'dimensions_weight_rops_4wd',
    'dimensions_front_weights_length',
    'engine_rated_engine_speed',
    'hydraulic_implement_pump_base'
]
skiped = []
def from_ritchiespecs(manufacturer: str, category: str, additional_specifications: dict[EquipmentModelMetadata], model_data: dict) -> EquipmentModel:
    specifications = model_data['specifications']
    specs = {}
    for specification in specifications:
        topparam_key = clean_key(specification['topparam'])
        for subparam in specification['subparam']:
            subparam_key = clean_key(subparam['name'] if 'name' in subparam else subparam['subparam'])
            param_key = f"{topparam_key}_{subparam_key}"
            if param_key not in common_keys_convert.keys() and param_key not in skiped and param_key not in skip_list:
                print(f"Unknown param {category} {param_key} {subparam}")
                skiped.append(param_key)
            elif param_key in common_keys_convert.keys():
                if 'unit2' in subparam:
                    if subparam['value2'] == '-':
                        continue
                    match subparam['unit2'].lower():
                        case 'mm':
                            specs[common_keys_convert[param_key]] = float(subparam['value2']) / 1000.0
                        case 'cm':
                            specs[common_keys_convert[param_key]] = float(subparam['value2']) / 100.0
                        case 'kg':
                            specs[common_keys_convert[param_key]] = float(subparam['value2'])
                        case 'm':
                            specs[common_keys_convert[param_key]] = float(subparam['value2'])
                        case 'kw':
                            specs[common_keys_convert[param_key]] = float(subparam['value2'])
                        case 'l':
                            specs[common_keys_convert[param_key]] = float(subparam['value2'])
                        case 'l/min':
                            specs[common_keys_convert[param_key]] = float(subparam['value2'])
                        case 'nm':
                            specs[common_keys_convert[param_key]] = float(subparam['value2'])
                        case 'km/h':
                            specs[common_keys_convert[param_key]] = float(subparam['value2'])
                        case _:
                            raise Exception(f"Unknown unit2 {subparam['unit2'].lower()}")
                elif 'value2' in subparam and str(subparam['value2']).isdigit():
                    specs[common_keys_convert[param_key]] = float(subparam['value2'])
                else:
                    print(f"Does not have metric value {subparam}")
        for key, value in additional_specifications.items():
            specs[key] = value
    return EquipmentModel(manufacturer, model_data['model'], category, EquipmentLevelCode.Base, -1, specs, [f"https://www.ritchiespecs.com/model/{model_data['slug']}"])

def get_ritchiespecs() -> list[EquipmentModel]:
    items = []
    for file in os.listdir('data/ritchiespecs'):
        category = file.replace('_data.json', '')
        data = open_json(f"data/ritchiespecs/{file}")
        for manufacturer_data in data.values():
            manufacturer = manufacturer_data['manufacturer']
            for model_data in manufacturer_data['models']:
                if 'specifications' not in model_data:
                    continue
                common_category = ''
                additional_specs = {}
                match category:
                    case '2wd_tractor':
                        additional_specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x2'
                        common_category = EquipmentCategory.Tractor
                    case '4wd_tractor':
                        additional_specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x4'
                        common_category = EquipmentCategory.Tractor
                    case 'mfwd_tractor':
                        additional_specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x4'
                        common_category = EquipmentCategory.Tractor
                    case 'utility_tractor':
                        additional_specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x2'
                        common_category = EquipmentCategory.Tractor
                    case 'air_drill':
                        common_category = EquipmentCategory.Seeder
                    case 'baler':
                        common_category = EquipmentCategory.BalerPress
                    case 'combine':
                        common_category = EquipmentCategory.Combine
                    case 'cultivator':
                        common_category = EquipmentCategory.Cultivator
                    case 'disc':
                        common_category = EquipmentCategory.Disc   
                    case 'harrow':
                        common_category = EquipmentCategory.Harrow    
                    case 'sprayer':
                        common_category = EquipmentCategory.Sprayer 
                    case 'swather':
                        common_category = EquipmentCategory.Mower    
                    case _:
                        raise Exception(f"Unknown category {category}")

                items.append(from_ritchiespecs(manufacturer, common_category, additional_specs, model_data).toDict())
    return items
save_json('ritchiespecs_data.json', get_ritchiespecs())