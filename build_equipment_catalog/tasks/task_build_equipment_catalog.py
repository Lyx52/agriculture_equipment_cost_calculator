from utils import normalize_text, EquipmentModel, save_json, open_json, convert_zs_to_kw
import os, re
combine_manufacturers = {
    'LS TRACTOR': 'LS',
    'LS MTRON': 'LS',
}
allowed_categories = [codifier['Code'] for codifier in open_json("../data/codifiers/codifiers.json")]
allowed_categories.append('lauksaimniecibas_traktors')
repair_value_categories = list(open_json('../data/repair_values/values.json').keys())
print(repair_value_categories)
parameters = {

}
uncategorized = []
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
            case 'zales apstrade':
                match value:
                    case 'bez zāles apstrādes':
                        specs['WithConditioner'] = False
                    case 'ar plucinātāju':
                        specs['WithConditioner'] = True
                    case 'ar placinātāju':
                        specs['WithConditioner'] = True
                    case _:
                        raise Exception(value)
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
    
    # Traktori;Traktors 4x4;tractor
    # Traktori;Traktors 4x2;tractor
    # Traktori;Traktors Ķēžu;tractor
    if equipment_type_code == 'lauksaimniecibas_traktors':
        match specs['PowerTrainCode']:
            case 'powertrain_4x4':
                equipment_type_code = normalize_text('Traktors 4x4').replace(' ', '_')
            case 'powertrain_track':
                equipment_type_code = normalize_text('Traktors Ķēžu').replace(' ', '_')
            case _:
                equipment_type_code = normalize_text('Traktors 4x2').replace(' ', '_')
    match equipment_type_code:
        case 'traktors_4x2':
            specs['RepairValueCode'] = 'traktors_4x2'
        case 'traktors_4x4':
            specs['RepairValueCode'] = 'traktors_4x4'
        case 'traktors_kezu':
            specs['RepairValueCode'] = 'traktors_4x4'
        case 'traktors_kezu':
            specs['RepairValueCode'] = 'traktors_4x4'
        case 'kipu_prese':
            specs['RepairValueCode'] = 'kipu_prese'
        case 'kartupelu_novaksanas_kombains':
            specs['RepairValueCode'] = 'kartupelu_novaksanas_kombains'
        case 'ecesas':
            specs['RepairValueCode'] = 'ecesas'
        case 'freze':
            specs['RepairValueCode'] = 'ecesas'
        case 'dzilirdinatajs':
            specs['RepairValueCode'] = 'ecesas'
        case 'valotajsarditajs':
            specs['RepairValueCode'] = 'ecesas'
        case 'kombaina_heders':
            specs['RepairValueCode'] = 'heders_uzkarinams'
        case 'darzenu_stadama_masina':
            specs['RepairValueCode'] = 'rindu_staditajs'
        case 'ritulu_prese':
            specs['RepairValueCode'] = 'lielo_ritulu_prese'
        case 'prese_ar_ietineju':
            specs['RepairValueCode'] = 'lielo_ritulu_prese'
        case 'ietinejs':
            specs['RepairValueCode'] = 'lielo_ritulu_prese'
        case 'pleves_ieklajejs':
            specs['RepairValueCode'] = 'lielo_ritulu_prese'
        case 'skidrmeslu_cisterna':
            specs['RepairValueCode'] = 'meslojuma_izkliedetajs'
        case 'skidrmeslu_izkliedes_caurulvadu_sistema':
            specs['RepairValueCode'] = 'meslojuma_izkliedetajs'
        case 'skidrmeslu_izkliedetaja_aprikojums':
            specs['RepairValueCode'] = 'meslojuma_izkliedetajs'
        case 'organisko_meslu_izkliedetajs':
            specs['RepairValueCode'] = 'meslojuma_izkliedetajs'
        case 'mineralmeslu_un_kalka_izkliedetajs':
            specs['RepairValueCode'] = 'meslojuma_izkliedetajs'
        case 'tunelu_sistema_skabbaribai':
            specs['RepairValueCode'] = 'meslojuma_izkliedetajs'
        case 'darzenu_novaksanas_kombains':
            if 'SelfPropelled' in specs and specs['SelfPropelled']:
                specs['RepairValueCode'] = 'pasgajejkombains_sp'
            else:
                specs['RepairValueCode'] = 'kombains_sp'
        case 'graudaugu_kombains':
            if 'SelfPropelled' in specs and specs['SelfPropelled']:
                specs['RepairValueCode'] = 'pasgajejkombains_sp'
            else:
                specs['RepairValueCode'] = 'kombains_sp'
        case 'ogu_novaksans_kombains':
            if 'SelfPropelled' in specs and specs['SelfPropelled']:
                specs['RepairValueCode'] = 'pasgajejkombains_sp'
            else:
                specs['RepairValueCode'] = 'kombains_sp'
        case 'sejmasina':
            specs['RepairValueCode'] = 'graudu_sejmasina'
        case 'sikseklu_sejmasina':
            specs['RepairValueCode'] = 'graudu_sejmasina'
        case 'precizas_izsejas_sejmasina':
            specs['RepairValueCode'] = 'graudu_sejmasina'
        case 'rindstarpu_kultivators':
            specs['RepairValueCode'] = 'rindstarpu_kultivators'
        case 'rugaines_kultivators':
            specs['RepairValueCode'] = 'lauku_kultivators'
        case 'kultivators':
            specs['RepairValueCode'] = 'lauku_kultivators'
        case 'komposta_apversejs':
            specs['RepairValueCode'] = 'lauku_kultivators'
        case 'kartupelu_vagotajs':
            specs['RepairValueCode'] = 'lauku_kultivators'
        case 'arkls':
            specs['RepairValueCode'] = 'plough'
        case 'kartupelu_stadama_masina':
            specs['RepairValueCode'] = 'rindu_staditajs'
        case 'auglu_koku_un_ogulaju_stadama_masina':
            specs['RepairValueCode'] = 'rindu_staditajs'
        case 'stadu_konteineru_pildisanas_un_stadisanas_iekarta':
            specs['RepairValueCode'] = 'rindu_staditajs'
        case 'plaujmasina':
            has_conditioner = 'WithConditioner' in specs and specs['WithConditioner']
            has_disc_shredder = 'ShredderType' in specs and specs['ShredderType'] == 'disc'
            if has_conditioner and has_disc_shredder:
                specs['RepairValueCode'] = 'plaujmasinakondicionieris_rotacijas'
            elif has_conditioner:
                specs['RepairValueCode'] = 'plaujmasinakondicionieris'
            elif has_disc_shredder:
                specs['RepairValueCode'] = 'plaujmasinas_rotacijas'
            else:
                specs['RepairValueCode'] = 'plaujmasina_piku'
        case 'maurina_plaujmasina':
            has_conditioner = 'WithConditioner' in specs and specs['WithConditioner']
            has_disc_shredder = 'ShredderType' in specs and specs['ShredderType'] == 'disc'
            if has_conditioner and has_disc_shredder:
                specs['RepairValueCode'] = 'plaujmasinakondicionieris_rotacijas'
            elif has_conditioner:
                specs['RepairValueCode'] = 'plaujmasinakondicionieris'
            elif has_disc_shredder:
                specs['RepairValueCode'] = 'plaujmasinas_rotacijas'
            else:
                specs['RepairValueCode'] = 'plaujmasina_piku'
        case 'lakstu_plavejs':
            has_conditioner = 'WithConditioner' in specs and specs['WithConditioner']
            has_disc_shredder = 'ShredderType' in specs and specs['ShredderType'] == 'disc'
            if has_conditioner and has_disc_shredder:
                specs['RepairValueCode'] = 'plaujmasinakondicionieris_rotacijas'
            elif has_conditioner:
                specs['RepairValueCode'] = 'plaujmasinakondicionieris'
            elif has_disc_shredder:
                specs['RepairValueCode'] = 'plaujmasinas_rotacijas'
            else:
                specs['RepairValueCode'] = 'plaujmasina_piku'
        case 'veltnis':
            specs['RepairValueCode'] = 'plaujmasinakondicionieris'
        case 'skabbaribas_blietetajveltnis':
            specs['RepairValueCode'] = 'plaujmasinakondicionieris'
        case 'akmenu_vacejs':
            specs['RepairValueCode'] = 'plaujmasinakondicionieris'
        case 'trimmeris':
            specs['RepairValueCode'] = 'plaujmasinas_rotacijas'
        case 'diski':
            specs['RepairValueCode'] = 'smagie_diski'
        case 'razas_novaksanas_platforma':
            specs['RepairValueCode'] = 'piekabe'
        case 'salmu_smalcinatajsizkliedetajs':
            specs['RepairValueCode'] = 'stublaju_smalcinatajs'
        case 'skeldotajs':
            specs['RepairValueCode'] = 'stublaju_smalcinatajs'
        case 'mulceris':
            specs['RepairValueCode'] = 'stublaju_smalcinatajs'
        case 'miglotajs':
            specs['RepairValueCode'] = 'smidzinatajs_ar_pneimatiskais'
        case 'smidzinatajs':
            specs['RepairValueCode'] = 'smidzinatajs_ar_pneimatiskais'
        case 'udens_suknis':
            specs['RepairValueCode'] = 'smidzinatajs_ar_pneimatiskais'
        case 'laistisanas_iekarta':
            specs['RepairValueCode'] = 'stangu_tipa_smidzinatajs'
        case 'sluce':
            specs['RepairValueCode'] = 'stangu_tipa_smidzinatajs'
        case 'savacejpiekabe':
            specs['RepairValueCode'] = 'lopbaribas_piekabe'
        case _:
            if equipment_type_code not in uncategorized:
                uncategorized.append(equipment_type_code)
        
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
built = get_lad_catalog()
save_json('../data/catalog_data.json', built)
save_json('../data/unused_lad_params.json', parameters)
save_json('../data/uncategorized.json', uncategorized)