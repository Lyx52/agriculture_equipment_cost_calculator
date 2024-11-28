from utils import open_json, clean_key, save_json, normalize_text, sentence_transformer_fuzzy_similarity, rapidfuzz_similarity
combined = open_json('lad_catalog_data.json')
tractor_data = open_json('tractordata_catalog.json')
not_matching = []
matching = 0
for item in combined:
    if item['category'] != 'tractor':
        continue
    was_matched = False
    for tractordata in tractor_data:
        if tractordata['category'] != 'tractor':
            continue
        if str(tractordata['manufacturer_key']) != str(item['manufacturer_key']):
            continue
        if str(tractordata['model_key']) != str(item['model_key']):
            continue
        was_matched = True
    if not was_matched:
        not_matching.append(f"{item['manufacturer']} {item['model']}")
    else: 
        matching += 1
print(len(not_matching), matching)
save_json('not_matching.json', not_matching)

from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer('all-MiniLM-L6-v2')

combined = open_json('lad_catalog_data.json')
tractor_data = open_json('tractordata_catalog.json')
not_matching = []
matching = []

for item in combined:
    if item['category'] != 'tractor':
        continue
    for tractordata in tractor_data:
        if tractordata['category'] != 'tractor':
            continue
        similarity = rapidfuzz_similarity(f"{tractordata['manufacturer']} {tractordata['model']}", f"{item['manufacturer']} {item['model']}")
        #print(f"{tractordata['manufacturer']} {tractordata['model']}", f"{item['manufacturer']} {item['model']}", similarity)
        if (similarity > 0.95):
            matching.append(
                ''.join([f"{tractordata['manufacturer']} {tractordata['model']}", f"{item['manufacturer']} {item['model']}", str(similarity)])
            )
            break
save_json('matching.json', matching)
# # items_tractordata = open_json('tractordata_catalog.json')
# # combined_lad_tractordata = build_combined(items_lad, items_tractordata)
# # items_ritchiespecs = open_json('ritchiespecs_data.json')
# # combined = build_combined(combined_lad_tractordata, items_ritchiespecs)
# print(f"Built in total {len(combined)} items...")
# save_json('combined_data.json', combined)