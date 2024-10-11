from utils import open_json, clean_key, save_json, avg, clean_currency
import json, re
from difflib import get_close_matches
lad_catalog = open_json('final.json')
scraped_keys = [
    "fuel_tank",
    "wheelbase",
    "weight",
    "front_tire",
    "rear_tire",
    "batteries",
    "engine",
    "drawbar_tested",
    "pto_claimed",
    "pto_tested",
    "factory",
    "chassis",
    "steering",
    "brakes",
    "transmission",
    "total_flow",
    "rear_rpm",
    "original_price",
    "drawbar",
    "clutch",
    "engine_rpm",
    "2wd_wheelbase",
    "4wd_wheelbase",
    "rear_lift",
    "engine_gross",
    "transmissions",
    "engine_net"
] 
lad_keys = [
    'aprikojuma_apraksts', 
    'dzinejs_jauda_zs', 
    'dzinejs_cilindru_skaits', 
    'ritenu_formula', 
    'transmisija_parnesumu_skaits_uz_prieksu', 
    'transmisija_parnesumu_skaits_atpakal', 
    'transmisija_bezpakapju', 
    'hidrosukna_razigums_l_min', 
    'uzkares_celtspeja_kg'
]
common_keys_names = {
    'dzinejs_jauda_zs': 'power',
    'engine_net': 'power',
    'engine_gross': 'power',
    'engine': 'power',
    'uzkares_celtspeja_kg': 'rear_lift',
    'rear_lift': 'rear_lift',
    'transmisija_bezpakapju': 'transmission',
    'transmissions': 'transmission',
    'weight': 'weight',
    'original_price': 'price'
}
equipment_level_convert = {
    'B\u0101zes': 'base',
    'Vid\u0113jais': 'medium',
    'Premium': 'premium'
}
# https://www.calculatorsoup.com/calculators/conversions/power.php zs -> kw 
# https://www.calculatorsoup.com/calculators/conversions/pounds-to-kilograms.php lb -> kg 
# https://api.frankfurter.app -> currency
common_keys_convert = {
    'dzinejs_jauda_zs': lambda v: float(v) * 0.7457,
    'transmisija_bezpakapju': lambda v: '' if str(v).lower() == 'nē' else 'continuously variable transmission',
    'weight': lambda v: v['value'] if type(v) is dict and 'value' in v else avg(re.findall('\d+', v)) * 0.45359237,
    'rear_lift': lambda v: v['value'] if type(v) is dict and 'value' in v else v,
    'engine': lambda v: v['value'] if type(v) is dict and 'value' in v else v,
    'engine_gross': lambda v: v['value'] if type(v) is dict and 'value' in v else v,
    'engine_net': lambda v: v['value'] if type(v) is dict and 'value' in v else v,
    'original_price': lambda v: clean_currency(v)
}
tractors = {}
# Load data from lad
for item in lad_catalog:
    cleaned_key = clean_key(str(item['category']))
    if cleaned_key == 'traktori':
        cleaned_mark = clean_key(item['mark'])
        if cleaned_mark not in tractors:
            tractors[cleaned_mark] = {
                'models': {},
                'mark': item['mark']
            }
        model_key = clean_key(item['model'])
        equipment_level = equipment_level_convert[item['equipment_level']] if 'equipment_level' in item else 'base'
        
        if model_key not in tractors[cleaned_mark]['models']:
            tractors[cleaned_mark]['models'][model_key] = {}
            models = {}
        else:
            models = tractors[cleaned_mark]['models'][model_key]['types']
        model = {}
        if 'price' in item:
            model = {
                'source': [item['source']],
                'price': float(item['price'])
            }
        
        for metadata_key, metadata_value in item['metadata'].items():
            if metadata_key not in common_keys_names.keys():
                continue
            value = metadata_value
            if metadata_key in common_keys_convert.keys():
                value = common_keys_convert[metadata_key](value)
            new_key = common_keys_names[metadata_key]

            model[new_key] = value
        models[equipment_level] = model    

        tractors[cleaned_mark]['models'][model_key]['types'] = models
        tractors[cleaned_mark]['models'][model_key]['model'] = item['model']
save_json('tractors.json', tractors)

# Load data from tractordata
tractordata_catalog = open_json('tractor_data_catalog.json')
for mark_key, mark_data in tractordata_catalog.items():
    if mark_key not in tractors:
        tractors[mark_key] = {
            'models': {},
            'mark': mark_data['mark']
        }
    for model_key, model_data in mark_data['models'].items():
        equipment_level = 'base'

        if model_key not in tractors[mark_key]['models']:
            tractors[mark_key]['models'][model_key] = {
                'types': {}
            }
            models = {}
        else:
            models = tractors[mark_key]['models'][model_key]['types']
        model = models[equipment_level] if equipment_level in models else {}

        # Dont overwrite LAD data...
        for metadata_key, metadata_value in model_data['metadata'].items():
            if metadata_key not in common_keys_names.keys():
                continue
            value = metadata_value
            if metadata_key in common_keys_convert.keys():
                value = common_keys_convert[metadata_key](value)
            new_key = common_keys_names[metadata_key]
            if new_key not in model:
                model[new_key] = value
        if 'source' in model:
            model['source'].append(model_data['url'])
        else:
            model['source'] = [model_data['url']]    

        models[equipment_level] = model    

        tractors[mark_key]['models'][model_key]['types'] = models
        tractors[mark_key]['models'][model_key]['model'] = model_data['model']

save_json('tractors.json', tractors)

# available_marks = {}
# available_models = {}
# for item in lad_catalog:
#     cleaned_key = clean_key(str(item['category']))
#     if cleaned_key == 'traktori':
#         cleaned_mark = clean_key(item['mark'])
#         if cleaned_mark not in available_marks.keys():
#             available_marks[cleaned_mark] = item['mark']
#         if cleaned_mark not in available_models:
#             available_models[cleaned_mark] = {}
#         cleaned_model = clean_key(item['model'])
#         if cleaned_model not in available_models[cleaned_mark].keys():
#             available_models[cleaned_mark][cleaned_model] = item['model']

# tractor_data_catalog = open_json('tractor_data_catalog.json')
# for key, value in tractor_data_catalog.items():
#     cleaned_mark = clean_key(value['mark'])
#     if cleaned_mark not in available_marks.keys():
#         available_marks[cleaned_mark] = value['mark'] 
#     if cleaned_mark not in available_models:
#         available_models[cleaned_mark] = {}
#     for model_key, model_value in value['models'].items():
#         cleaned_model = clean_key(model_value['model'])
#         if cleaned_model not in available_models[cleaned_mark].keys():
#             available_models[cleaned_mark][cleaned_model] = model_value['model']

# print(available_models)
# with open('test.json', 'w') as fp:
#     json.dump(available_models, fp)
# for key in available_models.keys():
#     for model_key, model_name in available_models[key].items():
#         similar = list(filter(lambda k: k != model_name, get_close_matches(str(model_name), available_models[key].values())))
#         if len(similar) > 0:
#             print(f"{model_name} ==> {similar}")