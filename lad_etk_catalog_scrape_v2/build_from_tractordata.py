from equipment_model import EquipmentModelMetadata, EquipmentModel, EquipmentLevelCode, EquipmentCategory, EquipmentSubCategory
from utils import open_json, save_json, clean_key, clean_value, convert_zs_to_kw, avg
import os, re
convert_marks = {
    'ls_tractor': 'LS',
    'ls_mtron': 'LS'
}
def from_tractordata(manufacturer: str, model_data: dict) -> EquipmentModel:
    specs = {}
    for key, value in model_data['metadata'].items():
        match key:
            case 'fuel_tank':
                specs[EquipmentModelMetadata.FuelCapacity.value[0]] = float(value['value'])
            case 'fuel':
                specs[EquipmentModelMetadata.FuelCapacity.value[0]] = float(value['value'])
            case 'rops_fuel':
                specs[EquipmentModelMetadata.FuelCapacity.value[0]] = float(value['value'])
            case 'cab_fuel':
                specs[EquipmentModelMetadata.FuelCapacity.value[0]] = float(value['value'])
            case 'gas_fuel_tank':
                specs[EquipmentModelMetadata.FuelCapacity.value[0]] = float(value['value'])    
            case 'lpgas_fuel_tank':
                specs[EquipmentModelMetadata.FuelCapacity.value[0]] = float(value['value'])    
            case '4wd_fuel_tank':
                specs[EquipmentModelMetadata.FuelCapacity.value[0]] = float(value['value'])
            case '2wd_fuel_tank':
                specs[EquipmentModelMetadata.FuelCapacity.value[0]] = float(value['value'])
            case 'rops_fuel_tank':
                specs[EquipmentModelMetadata.FuelCapacity.value[0]] = float(value['value'])
            case 'cab_fuel_tank':
                specs[EquipmentModelMetadata.FuelCapacity.value[0]] = float(value['value'])
            case 'engine':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.EnginePowerKw.value[0]] =  float(value['value'])
            case 'engine_max':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.EnginePowerKw.value[0]] =  float(value['value'])
            case 'engine_net':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.EnginePowerKw.value[0]] =  float(value['value'])
            case 'engine_gross':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.EnginePowerKw.value[0]] =  float(value['value'])
            case 'drawbar_tested':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.DrawbarPowerKw.value[0]] =  float(value['value'])
            case 'diesel_drawbar_claimed':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.DrawbarPowerKw.value[0]] =  float(value['value'])
            case 'gas_drawbar_claimed':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.DrawbarPowerKw.value[0]] =  float(value['value'])
            case 'lpgas_drawbar_claimed':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.DrawbarPowerKw.value[0]] =  float(value['value'])
            case 'drawbar_claimed':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.DrawbarPowerKw.value[0]] =  float(value['value'])
            case 'hydro_pto_claimed':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.PtoPowerKw.value[0]] =  float(value['value'])
            case 'gear_pto_claimed':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.PtoPowerKw.value[0]] =  float(value['value'])
            case 'pto_claimed':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.PtoPowerKw.value[0]] =  float(value['value'])
            case 'diesel_pto_claimed':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.PtoPowerKw.value[0]] =  float(value['value'])
            case 'gas_pto_claimed':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.PtoPowerKw.value[0]] =  float(value['value'])
            case 'shuttle_pto_claimed':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.PtoPowerKw.value[0]] =  float(value['value'])
            case 'lpgas_pto_claimed':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.PtoPowerKw.value[0]] =  float(value['value'])
            case 'pto_tested':
                if value['unit'] != 'kw':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.PtoPowerKw.value[0]] =  float(value['value'])
            case 'rear_lift_at_24_610mm':
                if value['unit'] != 'kg':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.LiftCapacity.value[0]] = float(value['value'])
            case 'rear_lift_at_ends':
                if value['unit'] != 'kg':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.LiftCapacity.value[0]] = float(value['value'])
            case 'rear_lift':
                if value['unit'] != 'kg':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.LiftCapacity.value[0]] = float(value['value'])
            case 'cvt_rear_lift_at_24_610mm':
                if value['unit'] != 'kg':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.LiftCapacity.value[0]] = float(value['value'])
            case 'cvt_rear_lift':
                if value['unit'] != 'kg':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.LiftCapacity.value[0]] = float(value['value'])
            case 'front_lift':
                if value['unit'] != 'kg':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.FrontLiftCapacity.value[0]] = float(value['value'])
            case 'front_lift_at_24_610mm':
                if value['unit'] != 'kg':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.FrontLiftCapacity.value[0]] = float(value['value'])
            case 'front_lift_at_ends':
                if value['unit'] != 'kg':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.FrontLiftCapacity.value[0]] = float(value['value'])
            case 'total_flow':
                if value['unit'] != 'lpm':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value['value'])
            case 'shuttle_pump_flow':
                if value['unit'] != 'lpm':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value['value'])
            case 'shuttle_total_flow':
                if value['unit'] != 'lpm':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value['value'])
            case 'hydro_pump_flow':
                if value['unit'] != 'lpm':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value['value'])
            case 'hydro_total_flow':
                if value['unit'] != 'lpm':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value['value'])
            case 'pump_flow':
                if value['unit'] != 'lpm':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value['value'])
            case '2wd_pump_flow':
                if value['unit'] != 'lpm':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value['value'])
            case '2wd_total_flow':
                if value['unit'] != 'lpm':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value['value'])
            case '4wd_pump_flow':
                if value['unit'] != 'lpm':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value['value'])
            case '4wd_total_flow':
                if value['unit'] != 'lpm':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value['value'])
            case 'weight':
                if type(value) is not dict:
                    if 'pounds' in value:
                        specs[EquipmentModelMetadata.Weight.value[0]] = avg(re.findall('[0-9]+', value)) * 0.45359237
                        continue
                    raise Exception(f"Unhandled type {key} {value}")
                if value['unit'] != 'kg':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.Weight.value[0]] = float(value['value'])
            case 'scv_flow':
                specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value['value'])
            case 'wheelbase':
                if value['unit'] != 'cm':
                    raise Exception(f"Unknown value {key} -> {value}")
                specs[EquipmentModelMetadata.Wheelbase.value[0]] = float(value['value']) / 100.0
            case 'drive':
                if '4x4' in value.lower():
                    specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x4'
                    continue
                if '4x2' in value.lower() or '2x4' in value.lower():
                    specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x2'
                    continue
                if '2wd' in value.lower():
                    specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x2'
                    continue
                if '4wd' in value.lower():
                    specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x4'
                    continue
                if 'crawler' in value.lower():
                    specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x4'
                    continue
                continue
            case 'chassis':
                if '4x4' in value.lower():
                    specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x4'
                    continue
                if '4x2' in value.lower() or '2x4' in value.lower():
                    specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x2'
                    continue
                if '2wd' in value.lower():
                    specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x2'
                    continue
                if '4wd' in value.lower():
                    specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x4'
                    continue
                if 'crawler' in value.lower():
                    specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x4'
                    continue
                continue
            case _:
                if 'fuel_tank' in key:
                    if value['unit'] != 'l':
                        raise Exception(f"Unknown value {key} -> {value}")
                    specs[EquipmentModelMetadata.FuelCapacity.value[0]] = float(value['value'])
                    continue
                if 'pto_claimed' in key or 'pto_tested' in key:
                    if value['unit'] != 'kw':
                        raise Exception(f"Unknown value {key} -> {value}")
                    specs[EquipmentModelMetadata.PtoPowerKw.value[0]] =  float(value['value'])
                    continue
                if 'drawbar_claimed' in key or 'drawbar_tested' in key:
                    if value['unit'] != 'kw':
                        raise Exception(f"Unknown value {key} -> {value}")
                    specs[EquipmentModelMetadata.DrawbarPowerKw.value[0]] =  float(value['value'])
                    continue
                if 'wheelbase' in key:
                    if value['unit'] != 'cm':
                        raise Exception(f"Unknown value {key} -> {value}")
                    specs[EquipmentModelMetadata.Wheelbase.value[0]] = float(value['value']) / 100.0
                    continue
                if 'rear_lift_at_ends' in key or 'rear_lift_at' in key or '_rear_lift' in key:
                    if value['unit'] != 'kg':
                        raise Exception(f"Unknown value {key} -> {value}")
                    specs[EquipmentModelMetadata.LiftCapacity.value[0]] = float(value['value'])
                    continue
                if '_front_lift' in key:
                    if value['unit'] != 'kg':
                        raise Exception(f"Unknown value {key} -> {value}")
                    specs[EquipmentModelMetadata.FrontLiftCapacity.value[0]] = float(value['value'])
                    continue
                if 'scv_flow' in key:
                    if value['unit'] != 'lpm':
                        raise Exception(f"Unknown value {key} -> {value}")
                    specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value['value'])
                    continue
                if type(value) is dict:
                    print(f"Unknown param {key}, {value}")
                if key.isdigit():
                    continue
                #print(f"Unknown param {key}, {value}")
    clean_mark = clean_key(manufacturer)
    if clean_mark in convert_marks.keys():
        manufacturer = convert_marks[clean_mark]
    sub_category = 'tractor_4x4' if EquipmentModelMetadata.Powertrain.value[0] in specs and specs[EquipmentModelMetadata.Powertrain.value[0]] == '4x4' else 'tractor_4x2'
    return EquipmentModel(manufacturer, model_data['model'], 'tractor', sub_category, EquipmentLevelCode.Base.value, -1, specs, [model_data['url']])

def get_tractordata_catalog() -> list[EquipmentModel]:
    items = []
    if not os.path.exists('data/tractordata/tractor_data_catalog.json'):
        return items
    data = open_json('data/tractordata/tractor_data_catalog.json')
    for mark_data in data.values():
        for model_data in mark_data['models'].values():
            catalog_item = from_tractordata(mark_data['mark'], model_data)
            if catalog_item is None:
                continue
            items.append(catalog_item.toDict())
    return items
save_json('tractordata_catalog.json', get_tractordata_catalog())