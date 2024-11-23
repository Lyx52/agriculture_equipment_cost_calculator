from equipment_model import EquipmentModelMetadata, EquipmentModel, EquipmentLevelCode, EquipmentCategory, EquipmentSubCategory
from utils import open_json, save_json, clean_key, clean_value, convert_zs_to_kw
import os, re
common_categories_convert = {
    "Lauksaimniecības traktors": EquipmentCategory.Tractor,
    # "Diski": EquipmentCategory.Disc,
    # "Ecēšas": EquipmentCategory.Harrow,
    # "Arkls": EquipmentCategory.Plough,
    # "Smidzinātājs": EquipmentCategory.Sprayer,
    # "Organisko mēslu izkliedētājs": EquipmentCategory.Sprayer,
    # "Šķidrmēslu cisterna": EquipmentCategory.Sprayer,
    # "Sējmašīna": EquipmentCategory.Seeder,
    # "Sīksēklu sējmašīna": EquipmentCategory.Seeder,
    # "Pļaujmašīna": EquipmentCategory.Mower,
    # "Dārzeņu stādāmā mašīna": EquipmentCategory.Planter,
    # "Graudaugu kombains": EquipmentCategory.Combine,
    # "Ogu novākšans kombains": EquipmentCategory.Combine,
    # "Dārzeņu novākšanas kombains": EquipmentCategory.Combine,
    # "Rindstarpu kultivators": EquipmentCategory.Cultivator,
    # "Kultivators": EquipmentCategory.Cultivator,
    # "Rugaines kultivators": EquipmentCategory.Cultivator,
    # "Rituļu prese": EquipmentCategory.BalerPress,
    # "Dziļirdinātājs": EquipmentCategory.Plough,
    # "Minerālmēslu un kaļķa izkliedētājs": EquipmentCategory.Sprayer
}
common_equipment_level_convert = {
    "Premium": EquipmentLevelCode.Premium,
    "Vidējais": EquipmentLevelCode.Medium,
    "Bāzes": EquipmentLevelCode.Base
}
def from_lad_catalog(model_data: dict) -> EquipmentModel:
    specs = {}
    source = ""
    category = ""
    sub_category = ""
    manufacturer = ""
    model = ""
    equipment_level_code = EquipmentLevelCode.Base
    price = -1
    for key, value in model_data.items():
        cleaned_key = clean_key(key)
        match cleaned_key:
            case 'source':
                source = value
            case 'tehnikas_vieniba':
                if value not in common_categories_convert.keys():
                    print(f"Skipping category {value}...")
                    return None
                category = common_categories_convert[value]
            case 'marka':
                manufacturer = value
            case 'darba_platums_m':
                specs[EquipmentModelMetadata.WorkingWidth.value[0]] = float(value)
            case 'disku_diametrs_mm':
                specs[EquipmentModelMetadata.DiscDiameter.value[0]] = float(value) / 1000.0
            case 'motora_maksimala_jauda_zs':
                specs[EquipmentModelMetadata.EnginePowerKw.value[0]] = convert_zs_to_kw(float(value))
            case 'masa_kg':
                specs[EquipmentModelMetadata.Weight.value[0]] = float(value)
            case 'tvertnes_tilpums_l':
                specs[EquipmentModelMetadata.WorkCapacityL.value[0]] = float(value)
            case 'tvertnes_ietilpiba_l':
                specs[EquipmentModelMetadata.WorkCapacityL.value[0]] = float(value)
            case 'graudu_tvertnes_tilpums_l':
                specs[EquipmentModelMetadata.WorkCapacityL.value[0]] = float(value)
            case 'tvertnes_tilpums_l_seklas':
                specs[EquipmentModelMetadata.WorkCapacityL.value[0]] = float(value)
            case 'tvertnes_tilpums_l_mineralmeslu':
                specs[EquipmentModelMetadata.WorkCapacityL.value[0]] = float(value)
            case 'ietilpiba_m3':
                specs[EquipmentModelMetadata.WorkCapacityL.value[0]] = float(value) * 1000.0
            case 'bunkura_tilpums_m3':
                specs[EquipmentModelMetadata.WorkCapacityL.value[0]] = float(value) * 1000.0
            case 'tilpums_m3':
                specs[EquipmentModelMetadata.WorkCapacityL.value[0]] = float(value) * 1000.0
            case 'kravnesiba_t':
                specs[EquipmentModelMetadata.WorkCapacityKg.value[0]] = float(value) * 1000.0
            case 'tvertnes_ietilpiba_kg':
                specs[EquipmentModelMetadata.WorkCapacityKg.value[0]] = float(value)
            case 'hedera_platums_m':
                specs[EquipmentModelMetadata.WorkingWidth.value[0]] = float(value)
            case 'minimalais_darba_platums_m':
                specs[EquipmentModelMetadata.WorkingWidthMin.value[0]] = float(value)
            case 'maksimalais_darba_platums_m':
                specs[EquipmentModelMetadata.WorkingWidth.value[0]] = float(value)
            case 'pacelaja_platums_m':
                specs[EquipmentModelMetadata.WorkingWidth.value[0]] = float(value)
            case 'ritula_izmeri_m_platums':
                specs[EquipmentModelMetadata.BaleWidth.value[0]] = float(value)
            case 'ritula_izmeri_m_diametrs':
                specs[EquipmentModelMetadata.BaleDiameter.value[0]] = float(value)
            case 'modelis':
                model = value
            case 'aprikojuma_limenis':
                equipment_level_code = common_equipment_level_convert[value]
            case 'aprikojuma_apraksts':
                #print(list(map(lambda v: v.strip(), value.split(','))))
                if EquipmentModelMetadata.Powertrain.value[0] not in specs:
                    specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x4' if '4WD' in value or '4x4' in value else '4x2'
                continue
            case 'cena_bez_pvn_eur':
                price = float(value)
            case 'dzinejs_jauda_zs':
                specs[EquipmentModelMetadata.EnginePowerKw.value[0]] = convert_zs_to_kw(float(value))
            case 'dzinejs_cilindru_skaits':
                specs[EquipmentModelMetadata.EngineCylinders.value[0]] = int(value)
            case 'ritenu_formula':
                match value:
                    case 'kāpurķēžu':
                        specs[EquipmentModelMetadata.Powertrain.value[0]] = '4x4'
                    case _:
                        raise Exception(f"Unknown power train {value}")
            case 'hidrosukna_razigums_l_min':
                specs[EquipmentModelMetadata.HydraulicPumpFlowCapacity.value[0]] = float(value)
            case 'uzkares_celtspeja_kg':
                specs[EquipmentModelMetadata.LiftCapacity.value[0]] = float(value)
            case 'nepieciesama_maksimala_traktora_jauda_zs':
                specs[EquipmentModelMetadata.RequiredPowerKw.value[0]] = convert_zs_to_kw(float(value))
            case 'unknown':
                continue
            case 'numurs':
                continue
            case 'kategorija':
                continue
            case 'transmisija_parnesumu_skaits_uz_prieksu':
                continue
            case 'transmisija_parnesumu_skaits_atpakal':
                continue
            case 'transmisija_bezpakapju':
                continue
            case 'pievienosanas_veids_traktoram':
                continue
            case 'korpusu_skaits':
                continue
            case 'arkla_tips':
                continue
            case 'arkla_aizsardziba':
                continue
            case 'platuma_maina':
                continue
            case 'stiena_sekciju_skaits_gab':
                continue
            case 'tips':
                continue
            case 'darbibas_princips':
                continue
            case 'sesanas_iespejas':
                continue
            case 'griezejaparata_veids':
                continue
            case 'zales_apstrade':
                continue
            case 'kliedetajrullu_novietojums':
                continue
            case 'izkliedesana':
                continue
            case 'rindu_skaits':
                continue
            case 'rindstarpu_attalums_cm':
                continue
            case 'hedera_tips':
                continue
            case 'kulsanas_veids':
                continue
            case 'gaitas_iekarta':
                continue
            case 'piedzinas_veids':
                continue
            case 'pasgajejs':
                continue
            case 'preses_konstrukcija':
                continue
            case 'presesanas_kamera':
                continue
            case 'zaru_skaits_gab':
                continue
            case _:
                raise Exception(f"Unknown spec key {cleaned_key} -> {value}")
    if category == EquipmentCategory.Tractor:
        sub_category = EquipmentSubCategory.Tractor4x4 if specs[EquipmentModelMetadata.Powertrain.value[0]] == '4x4' else EquipmentSubCategory.Tractor4x2
    return EquipmentModel(manufacturer, model, category.value[0], sub_category.value, equipment_level_code.value, price, specs, [source])

def get_lad_catalog() -> list[EquipmentModel]:
    items = []
    if not os.path.exists('data/lad_catalog/catalog.json'):
        return items
    data = open_json('data/lad_catalog/catalog.json')
    for item in data:
        catalog_item = from_lad_catalog(item)
        if catalog_item is None:
            continue
        items.append(catalog_item.toDict())
    return items
save_json('lad_catalog_data.json', get_lad_catalog())