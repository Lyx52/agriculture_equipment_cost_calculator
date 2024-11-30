from utils import open_json, save_json, models_similar
lad_data = open_json('lad_catalog_data.json')
tractor_data = open_json('tractordata_catalog.json')
ritchiespecs_data = open_json('ritchiespecs_data.json')
lectura_spec_data = open_json('lectura_specs_catalog_data.json')
def build_combined(items_left, items_right):
    built_items = []
    for left_item in items_left:
        for index in range(len(items_right)):
            right_item = items_right[index]
            if models_similar(left_item, right_item):
                left_item['specification'] = {
                    **right_item['specification'],
                    **left_item['specification']
                }
                left_item['sources'].extend(right_item['sources'])
                if right_item['equipment_level_code'] == left_item['equipment_level_code']:
                    del items_right[index]
                break
        built_items.append(left_item)
    built_items.extend(items_right)
    return built_items

combined = build_combined(lad_data, tractor_data)
combined = build_combined(combined, ritchiespecs_data)
combined = build_combined(combined, lectura_spec_data)


required_specification_keys_by_category = {
    'tractor': [
        'weight',
        'engine_power_kw'
    ],
    'sowing_and_planting_equipment': [
        'required_power_kw',
        'working_width'
    ],
    'soil_cultivation_equipment': [
        'required_power_kw',
        'working_width'
    ],
    'feed_preperation_equipment': [
        'required_power_kw',
    ],
    'harvesting_equipment': [
        'weight',
        'engine_power_kw'
    ]
}
filtered = []
for item in combined:
    if 'price' not in item or item['price'] <= 0:
        continue
    has_required = True
    for required_key in required_specification_keys_by_category[item['category']]:
        if required_key not in item['specification']:
            has_required = False
            break
    if has_required:
        filtered.append(item)
print(f"Built in total {len(filtered)} items...")
save_json('combined_data.json', filtered)