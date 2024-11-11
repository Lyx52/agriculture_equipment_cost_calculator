from utils import open_json, clean_key, LadCatalog, save_json, TractorDataCatalog, clean_currency, MacusCatalog, first_or_default
import os
tractor_data_catalog = open_json('tractor_data_catalog.json')
unique_marks = {}
for item in tractor_data_catalog.values():
    key = clean_key(item['mark'])
    if key not in unique_marks:
        unique_marks[key] = item['mark']

lad_catalog = open_json('final.json')
for item in lad_catalog:
    key = clean_key(item['mark'])
    if key not in unique_marks:
        unique_marks[key] = item['mark']
        
if not os.path.exists('lad_catalog_new.json'):
    catalog = LadCatalog('final.json', unique_marks)
    lad_catalog = catalog.build()
    lad_catalog = list(filter(lambda item: item['category'] == 'tractors', lad_catalog))
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
    if 'chassis' in item['unsorted_metadata']:
        chassis_type = item['unsorted_metadata']['chassis']
        if ('4x4' in chassis_type.lower()) or ('4wd' in chassis_type.lower()) or ('crawler' in chassis_type.lower()):
            item['specification']['chassis'] = '4x4'
        else:
            item['specification']['chassis'] = '4x2'               
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
catalog = list(filter(lambda item: len(item['specification'].keys()) > 0, items))
save_json('technical_equipment.json', catalog)
