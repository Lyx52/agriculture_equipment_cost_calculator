from utils import open_json, clean_key, save_json
combined = open_json('lad_catalog_data.json')
tractor_data = open_json('tractordata_catalog.json')
not_matching = []
for item in combined:
    if item['category'] != 'tractor':
        continue
    was_matched = False
    for tractordata in tractor_data:
        if str(tractordata['manufacturer_key']) != str(item['manufacturer_key']):
            continue
        if str(tractordata['model_key']) != str(item['model_key']):
            continue
        was_matched = True
    if not was_matched:
        not_matching.append(f"{item['manufacturer']} {item['model']}")
save_json('not_matching.json', not_matching)
# items_tractordata = open_json('tractordata_catalog.json')
# combined_lad_tractordata = build_combined(items_lad, items_tractordata)
# items_ritchiespecs = open_json('ritchiespecs_data.json')
# combined = build_combined(combined_lad_tractordata, items_ritchiespecs)
print(f"Built in total {len(combined)} items...")
save_json('combined_data.json', combined)