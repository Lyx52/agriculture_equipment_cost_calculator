from utils import open_json, clean_key, LadCatalog, save_json, TractorDataCatalog, clean_currency, MacusCatalog, first_or_default
import os
if not os.path.exists('lad_catalog_new.json'):
    catalog = LadCatalog('final.json')
    lad_catalog = catalog.build()
    save_json('lad_catalog_new.json', lad_catalog)
else:
    lad_catalog = open_json('lad_catalog_new.json')

if not os.path.exists('lad_catalog_new_structured.json'):
    catalog = {}
    for item in lad_catalog:
        mark = clean_key(item['mark'])
        if mark not in catalog:
            catalog[mark] = []
        catalog[mark].append(item)
    save_json('lad_catalog_new_structured.json', catalog)
    lad_catalog = catalog
else:
    lad_catalog = open_json('lad_catalog_new_structured.json')

if not os.path.exists('tractor_data_catalog_new.json'):
    catalog = TractorDataCatalog('tractor_data_catalog.json')
    tractor_data_catalog = catalog.build()
    save_json('tractor_data_catalog_new.json', tractor_data_catalog)
else:
    tractor_data_catalog = open_json('tractor_data_catalog_new.json')


catalog = lad_catalog
for item in tractor_data_catalog:
    tractor_data_mark = clean_key(item['mark'])
    tractor_data_model = clean_key(item['model'])
    if tractor_data_mark in catalog.keys():
        lad_models =  catalog[tractor_data_mark]
    else:
        catalog[tractor_data_mark] = [item]
        continue
    lad_model = None
    for model in lad_models:
        lad_data_model = clean_key(model['model'])
        if lad_data_model == tractor_data_model and model['category'] == 'tractors':
            lad_model = model
    if lad_model is None:
        lad_models.append(item)
        continue

    for key in lad_model['specification'].keys():
        item['specification'][key] = lad_model['specification'][key]

    for key in item['specification'].keys():
        lad_model['specification'][key] = item['specification'][key]

    if 'price' in lad_model:
        item['price'] = lad_model['price']

    if 'sources' in lad_model:
        item['sources'].extend(lad_model['sources'])
        lad_model['sources'] = item['sources']
        
    if lad_model['equipment_level'] != item['equipment_level']:
        lad_models.append(item)

items = []
for mark in catalog.keys():
    items.extend(catalog[mark])
catalog = items
save_json('tractors.json', catalog)
#     lad_models = list(filter(lambda v: clean_key(v['mark']) == tractor_data_mark, catalog))
#     if len(lad_models) > 0:
#         print()
#     # if filtered_item is None:
#     #     print(f"{item['mark']}, {item['model']} => {tractor_data_mark}, {tractor_data_model}")

# def filter_items(value, mark, model):
#     return clean_key(value['mark']) == mark and clean_key(value['model']) == model
# catalog = MacusCatalog('')

# lad_mark_models = {}
# for item in lad_catalog:
#     lad_category = clean_key(item['category'])
#     if lad_category not in convert_categories.keys():
#         continue
#     category = convert_categories[lad_category]
#     mark = clean_key(item['mark'])
#     model = clean_key(item['model'])
#     if mark not in lad_mark_models:
#         lad_mark_models[mark] = []
#     lad_mark_models[mark].append(model)q

# tractordata_catalog = open_json('tractor_data_catalog.json')
# not_in_tractordata = list(filter(lambda k: k not in tractordata_catalog.keys(), [k for k in lad_mark_models.keys()]))
# print(not_in_tractordata)
# models_not_in_tractor_data = {}
# for mark, models in lad_mark_models.items():
#     if mark not in tractordata_catalog:
#         continue
#     tractor_data_models = tractordata_catalog[mark]['models'].keys()
#     for model in models:
        

#         new_models = convert_mark_models[mark][model] if mark in convert_mark_models and model in convert_mark_models[mark] else tractor_data_models
#         if mark not in models_not_in_tractor_data:
#             models_not_in_tractor_data[mark] = []
#         if model not in new_models:
#             models_not_in_tractor_data[mark].append(model)

# print(models_not_in_tractor_data)