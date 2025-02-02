from utils import open_json, save_json, normalize_text, rapidfuzz_similarity, word_overlap

category_mapping = {
    '2WD Tractor': ['traktors_4x2'],
    '4WD Tractor': ['traktors_4x4'],
    'Air Drill': ['sejmasina', 'sikseklu_sejmasina', 'precizas_izsejas_sejmasina'],
    'Baler': ['ritulu_prese', 'kipu_prese', 'ietinejs', 'prese_ar_ietineju'],
    'Combine': ['ogu_novaksans_kombains', 'graudaugu_kombains', 'darzenu_novaksanas_kombains', 'kartupelu_novaksanas_kombains'],
    'Cultivator': ['mulceris', 'rindstarpu_kultivators', 'rugaines_kultivators', 'dzilirdinatajs', 'arkls', 'freze', 'kultivators', 'salmu_smalcinatajsizkliedetajs', 'auglu_koku_un_ogulaju_stadama_masina', 'kartupelu_stadama_masina', 'akmenu_vacejs', 'pleves_ieklajejs', 'stadu_konteineru_pildisanas_un_stadisanas_iekarta', 'kartupelu_vagotajs', 'komposta_apversejs', 'darzenu_stadama_masina'],
    'Disc': ['diski'],
    'Harrow': ['veltnis', 'ecesas', 'skabbaribas_blietetajveltnis'],
    'MFWD Tractor': ['traktors_kezu'],
    'Sprayer': ['organisko_meslu_izkliedetajs', 'mineralmeslu_un_kalka_izkliedetajs', 'smidzinatajs', 'miglotajs', 'skidrmeslu_cisterna', 'skidrmeslu_izkliedes_caurulvadu_sistema', 'skidrmeslu_izkliedetaja_aprikojums', 'laistisanas_iekarta'],
    'Swather': ['plaujmasina', 'valotajsarditajs', 'lakstu_plavejs', 'maurina_plaujmasina', 'trimmeris'],
    'Utility Tractor': ['skeldotajs', 'sluce', 'traktors_4x2']
}

category_mapping_add = {
    '2WD Tractor': 'traktors_4x2',
    '4WD Tractor': 'traktors_4x4',
    'Air Drill': 'sejmasina',
    'Baler': 'ritulu_prese',
    'Combine': 'graudaugu_kombains',
    'Cultivator': 'kultivators',
    'Disc': 'diski',
    'Harrow': 'ecesas',
    'MFWD Tractor': 'traktors_4x4',
    'Sprayer': 'smidzinatajs',
    'Swather': 'plaujmasina',
    'Utility Tractor': 'traktors_4x2'
}


spec_mapping = {
    "WorkWidth": ["Cutting Width", "Working Width", "Max Working Width", "Min Working Width"],
    "RequiredPower": ["Rated Power", "Gross Power", "Net Power", "Horsepower", "Maximum Power", "Rated Engine Power Sae", "Power", "Rated Engine Horsepower", "Peak Rated Power", "Max. Horsepower", "Power Boost Power"],
    "WithConditioner": ["Self Leveling?", "Conditioner Type"],
    "ShredderType": ["Separator Type", "Rotor Type", "Threshing System Type- Rotary Or Conventional Cylinder"],
    "PowerTrainCode": ["Power Train", "Drive Wheels / Tracks", "Transmission Type", "Drive Wheels", "Gear Type", "Shuttle Type", "Power Shuttle", "Mechanical Shuttle"],
    "SelfPropelled": ["Self Propelled?", "Drive Train Type", "Wheel Drive"],
    "Power": ["Gross Power", "Net Power", "Rated Power", "Maximum Engine Power", "Power Boost", "Flywheel Power"],
    "PtoPower": ["Power Take-Off (Pto) Power"],
    "Weight": ["Operating Weight", "Weight", "Shipping Weight", "Total Weight", "Base Machine Weight", "Implement Weight", "Maximum Operating Weight", "Net Weight", "Dry Weight", "Baler Weight"],
    "FuelUsage": ["Fuel Usage @ 75% Load, Full Rpm", "Fuel Consumption"],
    "LiftingCapacity": ["Lift Capacity", "3 Point Hitch Lift Capacity @ 24 Inches", "Maximum Lift Capacity", "Lift Capacity At Ball Ends", "Lift Capacity At 24 In (610 Mm) Behind The Ball Ends", "Lift Capacity @ 24”", "3-Point Lift Capacity @ Ball Ends"],
    "Torque": ["Max Torque", "Torque Measured @", "Net Torque", "Gross Torque", "Maximum Torque", "Peak Torque", "Engine Peak Torque", "Maximum Torque (Pto)", "Torque Reserve", "Max Torque Iso Tr14396"]
}

def flatten(specifications):
    result = []
    for category in specifications:
        for manufacturer in category["manufacturers"]:
            if "models" not in manufacturer:
                continue
            for model in manufacturer["models"]:
                model["category"] = category["industryEquipment"]
                model["manufacturer"] = manufacturer["manufacturerName"]
                result.append(model)
    return result

def flatten_spec_list(spec_list):
    flattened_list = []
    for category in spec_list:
        topparam = category["topparam"]
        for sub in category["subparam"]:
            flat_entry = {"topparam": topparam, "subparam": sub["subparam"]}
            flat_entry.update({
                "unit1": sub.get("unit1", None),
                "value1": sub.get("value1", None),
                "unit2": sub.get("unit2", None),
                "value2": sub.get("value2", None)
            })
            flattened_list.append(flat_entry)
    return flattened_list

catalog = open_json('../data/catalog_data.json')
catalog_categorized = {}

def build_richietech(item):
    specifications = {}
    if "specifications" in item:
        print(item["specifications"])
        richietech_specifications = flatten_spec_list(item["specifications"])
        for spec in richietech_specifications:
            for mapped_spec, mapping in spec_mapping.items():
                if spec["subparam"] in mapping:
                    specifications[mapped_spec] = spec["value2"] if "value2" in spec else spec["value1"]
    print(specifications)
    return {
        "Model": item["modelname"],
        "Manufacturer": item["manufacturer"],
        "Price": 0,
        "EquipmentTypeCode": category_mapping_add[item["category"]],
        "Specifications": specifications
    }

def add_richietech_data(catalog_item, richietech_item):
    print(f"{catalog_item['Manufacturer']} {catalog_item['Model']} -> {richietech_item['manufacturer']} {richietech_item['modelname']}")
    pass

richietech_items = flatten(open_json("../data/richietech/specifications.json"))

updated_equipment = []
i = 1
for model in richietech_items:
    print(f"{i}/{len(richietech_items)}")
    best_match = None
    
    for equipment in catalog:
        if normalize_text(equipment["Manufacturer"]) != normalize_text(model['manufacturer']):
            continue
        if normalize_text(equipment["Model"]) in normalize_text(model['modelnumber']):
            best_match = equipment
    
    if best_match:
        add_richietech_data(best_match, model)
    else:
        new_entry = build_richietech(model)
        updated_equipment.append(new_entry)
    i += 1

# Append new models to base equipment list
# catalog.extend(updated_equipment)

#print(catalog_categorized)

