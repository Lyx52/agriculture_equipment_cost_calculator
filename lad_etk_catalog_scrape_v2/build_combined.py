from utils import open_json, clean_key, save_json
import time
def build_combined(items_left, items_right):
    built_items = []
    for left_item in items_left:
        found_item_index = -1
        for index in range(len(items_right)):
            right_item = items_right[index]
            if left_item['manufacturer_key'] == right_item['manufacturer_key'] and left_item['model_key'] == right_item['model_key']:
                found_item_index = index
        if found_item_index > 0:
            right_item = items_right[found_item_index]
            left_item['price'] = left_item['price'] if left_item['price'] > 0 else right_item['price']
            for key, value in right_item['specification'].items():
                if key not in left_item['specification']:
                    left_item['specification'][key] = value
            left_item['sources'].extend(right_item['sources'])
            if right_item['equipment_level_code'] == left_item['equipment_level_code']:
                del items_right[found_item_index]
        if len(left_item['specification'].keys()) > 0:
            built_items.append(left_item)
    built_items.extend(items_right)
    return built_items


items_lad = open_json('lad_catalog_data.json')
items_tractordata = open_json('tractordata_catalog.json')
combined_lad_tractordata = build_combined(items_lad, items_tractordata)
items_ritchiespecs = open_json('ritchiespecs_data.json')
combined = build_combined(combined_lad_tractordata, items_ritchiespecs)
print(f"Built in total {len(combined)} items...")
save_json('combined_data.json', combined)