from equipment_model import EquipmentModelMetadata, EquipmentModel, EquipmentLevelCode, EquipmentCategory
from utils import open_json, save_json, clean_key, clean_value
import os, re
common_keys_convert = {
    'operational_operating_weight': EquipmentModelMetadata.Weight.value[0],
    'dimensions_wheelbase': EquipmentModelMetadata.Wheelbase.value[0],
    'engine_pto_power': EquipmentModelMetadata.PtoPowerKw.value[0],
    'engine_displacement': EquipmentModelMetadata.EngineDisplacement.value[0],
    'engine_number_of_cylinders': EquipmentModelMetadata.EngineCylinders.value[0],
    'dimensions_overall_length': EquipmentModelMetadata.Length.value[0],
    'operational_fuel_capacity': EquipmentModelMetadata.FuelCapacity.value[0],
    'hydraulic_system_pump_flow_capacity': EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0],
    'engine_gross_power': EquipmentModelMetadata.EnginePowerKw.value[0],
    'engine_max_horsepower': EquipmentModelMetadata.EnginePowerKw.value[0],
    'engine_power': EquipmentModelMetadata.EnginePowerKw.value[0],
    'engine_max_torque': EquipmentModelMetadata.EngineTorque.value[0],
    'transmission_max_speed': EquipmentModelMetadata.MaxSpeed.value[0],
    'speeds_maximum_road_speed': EquipmentModelMetadata.MaxSpeed.value[0],
    'operational_3_point_hitch_lift_capacity_@_24_inches': EquipmentModelMetadata.LiftCapacity.value[0],
    'engine_fuel_tank': EquipmentModelMetadata.FuelCapacity.value[0],
    'powertrain': EquipmentModelMetadata.Powertrain.value[0]
}
unknown_params = []
def from_ritchiespecs(manufacturer: str, category: str, additional_specifications: dict[EquipmentModelMetadata], model_data: dict) -> EquipmentModel:
    global unknown_params
    specifications = model_data['specifications']
    specs = {}
    for specification in specifications:
        topparam_key = clean_key(specification['topparam'])
        for subparam in specification['subparam']:
            subparam_key = clean_key(subparam['name'] if 'name' in subparam else subparam['subparam'])
            param_key = f"{topparam_key}_{subparam_key}"
            if param_key in common_keys_convert.keys():
                
                if 'value2' not in subparam or ('value2' in subparam and subparam['value2'] == '-'):
                    if 'unit1' in subparam:
                        match subparam['unit1'].lower():
                            case 'lb':
                                specs[common_keys_convert[param_key]] = float(subparam['value1']) * 0.4535924
                            case 'mph':
                                specs[common_keys_convert[param_key]] = float(subparam['value1']) * 1.609344    
                            case _:
                                raise Exception(f"Unknown unit1 {subparam['unit1'].lower()}")    
                    continue
                if 'unit2' in subparam:
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
                elif 'value2' in subparam:
                    if 'cu. in' in subparam['value2']:
                        specs[common_keys_convert[param_key]] = float(re.findall('[0-9]+', subparam['value2'])[0]) * 0.01638706       
                        continue
                    try:
                        specs[common_keys_convert[param_key]] = float(subparam['value2'])
                    except:
                        pass
                else:
                    raise Exception(f"Unknown {subparam}")
            else:
                unknown_params.append(param_key)
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
                        additional_specs[EquipmentModelMetadata.Powertrain.value] = '4x2'
                        common_category = EquipmentCategory.Tractor
                    case '4wd_tractor':
                        additional_specs[EquipmentModelMetadata.Powertrain.value] = '4x4'
                        common_category = EquipmentCategory.Tractor
                    case 'mfwd_tractor':
                        additional_specs[EquipmentModelMetadata.Powertrain.value] = '4x4'
                        common_category = EquipmentCategory.Tractor
                    case 'utility_tractor':
                        additional_specs[EquipmentModelMetadata.Powertrain.value] = '4x2'
                        common_category = EquipmentCategory.Tractor
                    case 'air_drill':
                        common_category = EquipmentCategory.Seeder
                    case 'baler':
                        common_category = EquipmentCategory.BalerPress
                    case 'combine':
                        common_category = EquipmentCategory.Harvester
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