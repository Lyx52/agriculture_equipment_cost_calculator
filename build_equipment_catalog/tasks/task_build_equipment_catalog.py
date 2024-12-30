from utils import normalize_text, EquipmentModel, save_json, open_json, convert_zs_to_kw
import os, re
combine_manufacturers = {
    'LS TRACTOR': 'LS',
    'LS MTRON': 'LS',
}
allowed_categories = [codifier['Code'] for codifier in open_json("../data/codifiers/codifiers.json")]
parameters = {

}
def from_lad_catalog(model_data: dict) -> EquipmentModel:
    specs = {}
    equipment_type_code = normalize_text(model_data['Tehnikas vien\u012bba']).replace(' ', '_')
    manufacturer = ""
    model = ""
    price = -1
    unused_params = {}
    data = {}
    for key, value in model_data.items(): 
        data[normalize_text(key)] = value

    for key, value in data.items():
        match key:
            case 'cena bez pvn eur':
                price = round(float(value), 2)
                continue
            case 'marka':
                manufacturer = value.replace("'", "")
                continue
            case 'modelis':
                model = value.replace("'", "")
                continue
            case 'dzinejs jauda zs':
                specs['Power'] = convert_zs_to_kw(value)
                continue
            case 'motora maksimala jauda zs':
                specs['Power'] = convert_zs_to_kw(value)
                continue
            case 'jauda kw':
                specs['Power'] = round(float(value), 2)
                continue
            case 'iekartas jauda kw':
                specs['Power'] = round(float(value), 2)
                continue
            case 'nepieciesama traktora jauda zs':
                specs['RequiredPower'] = convert_zs_to_kw(value)
                continue
            case 'nepieciesamie traktora parametri jauda zs':
                specs['RequiredPower'] = convert_zs_to_kw(value)
                continue
            case 'nepieciesama agregatesanas jauda kw':
                specs['RequiredPower'] = round(float(value), 2)
                continue
            case 'nepieciesama jauda kw':
                specs['RequiredPower'] = round(float(value), 2)
                continue
            case 'nepieciesama maksimala traktora jauda zs':
                specs['RequiredPower'] = convert_zs_to_kw(value)
                continue
            case 'nepieciesama maksimala traktorapasa jauda zs':
                specs['RequiredPower'] = convert_zs_to_kw(value)
                continue
            case 'ritenu formula':
                match value:
                    case 'kāpurķēžu':
                        specs['PowerTrainCode'] = 'powertrain_track'
                    case '4x4':
                        specs['PowerTrainCode'] = 'powertrain_4x4'
                    case _:
                        raise Exception(f"Unknown powertrain {value}")
                continue
            case 'aprikojuma apraksts':
                if '4WD' in value or '4x4' in value:
                    specs['PowerTrainCode'] = 'powertrain_4x4'
            case 'darba platums m':
                specs['WorkWidth'] = round(float(value), 2)
                continue
            case 'maksimalais darba platums m':
                specs['WorkWidth'] = round(float(value), 2)
                continue
            case 'pacelaja darba platums m':
                specs['WorkWidth'] = round(float(value), 2)
                continue
            case 'hedera platums m':
                specs['WorkWidth'] = round(float(value), 2)
                continue
            case 'izkliedesana darba platums m':
                specs['WorkWidth'] = round(float(value), 2)
                continue
            case 'lemesa darba platums cm maksimalais':
                specs['WorkWidth'] = round(float(value) / 100, 2)
                continue
            case 'darba platums m horizontali':
                specs['WorkWidth'] = round(float(value), 2)
                continue
            case 'darba platums cm':
                specs['WorkWidth'] = round(float(value) / 100, 2)
                continue
            case 'rindstarpu platums mm':
                if 'rindu skaits' in data.keys():
                   specs['WorkWidth'] = round((float(value) * float(data['rindu skaits'])) / 1000, 2)
                continue
            case 'rindstarpu attalums cm':
                if 'rindu skaits' in data.keys():
                   specs['WorkWidth'] = round((float(value) * float(data['rindu skaits'])) / 100, 2)
                continue
            case 'smalcinataja tips':
                match value.lower():
                    case 'diska':
                        specs['ShredderType'] = 'disc'
                    case _:
                        raise Exception(value.lower())
                continue
            case 'griezejaparata veids':
                if type(value) == list:
                    value = value[0]
                match value.lower():
                    case 'disku':
                        specs['ShredderType'] = 'disc'
                    case 'trumuļu':
                        specs['ShredderType'] = 'drum'
                    case 'izkapts':
                        specs['ShredderType'] = 'scythe'
                    case 'rotējoši naži':
                        specs['ShredderType'] = 'rotors'
                    case 'cits':
                        pass
                    case _:
                        raise Exception(value.lower())
                continue
            case 'pievienosana veids traktoram':
                match value.lower():
                    case 'uzkarināms':
                        pass
                    case _:
                        raise Exception(value.lower())
                continue
            case 'tips':
                match value.lower():
                    case 'disku kultivātors':
                        specs['CultivatorType'] = 'disc'
                    case 'kaltu kultivators':
                        specs['CultivatorType'] = 'chisel'
                    case 'kaltu kultivators':
                        specs['CultivatorType'] = 'chisel'
                    case 'kaltu kultivators':
                        specs['CultivatorType'] = 'chisel'
                    case 'pašgājējs':
                        specs['SelfPropelled'] = True
                    case _:
                        # print(value.lower())
                        pass
                continue
            case 'izmeri mm platums':
                specs['WorkWidth'] = round(float(value) / 1000, 2)
                continue
            case 'maksimalais vagas platums m':
                specs['WorkWidth'] = round(float(value), 2)
                continue
            case 'rindstarpu attalums mm maksimalais':
                if 'rindu skaits' in data.keys():
                   specs['WorkWidth'] = round((float(value) * float(data['rindu skaits'])) / 1000, 2)
                continue
            case 'plausanas platums cm':
                specs['WorkWidth'] = round(float(value) / 100, 2)
                continue
            case 'pasgajejs':
                specs['SelfPropelled'] = value == 'Jā'
                continue
            case 'gaitas iekarta':
                match value.lower():
                    case '4x2':
                        specs['PowerTrainCode'] = 'powertrain_4x2'
                    case '4x4':
                        specs['PowerTrainCode'] = 'powertrain_4x4'
                    case 'riteņi':
                        pass
                    case 'ķēdes':
                        specs['PowerTrainCode'] = 'powertrain_track'
                    case 'kāpurķēžu':
                        specs['PowerTrainCode'] = 'powertrain_track'
                    case 'cits':
                        specs['PowerTrainCode'] = 'powertrain_4x2'
                    case _:
                        raise Exception(value.lower())
                continue
        if key not in unused_params:
            unused_params[key] = f'{value}; ' + model_data['source']

    if manufacturer in combine_manufacturers:
        manufacturer = combine_manufacturers[manufacturer]
    
    if equipment_type_code not in allowed_categories:
        return None
    
    for key, value in unused_params.items():
        if key not in parameters:
            parameters[key] = value
    
    return EquipmentModel(manufacturer, model, price, equipment_type_code, specs)

def get_lad_catalog() -> list[EquipmentModel]:
    items = []
    if not os.path.exists('../data/lad_catalog/lad_catalog.json'):
        return items
    data = open_json('../data/lad_catalog/lad_catalog.json')
    for item in data:
        catalog_item = from_lad_catalog(item)
        if catalog_item is None:
            continue
        items.append(catalog_item.to_dict())
    return items
save_json('../data/catalog_data.json', get_lad_catalog())
save_json('../data/unused_lad_params.json', parameters)