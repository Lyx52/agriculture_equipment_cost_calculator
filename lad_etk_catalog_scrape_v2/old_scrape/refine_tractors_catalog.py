from utils import open_json, clean_key, save_json, avg, clean_currency
tractors = open_json('tractors.json')
macus_listings = open_json('macus_catalog_tractor.json')
for mark in tractors.keys():
    for model in tractors[mark]['models'].keys():
        types = tractors[mark]['models'][model]['types']
        for key in ['price', 'weight', 'power']:
            try:
                avg_value = avg([t[key] for t in list(filter(lambda t: key in t, types.values()))])
            except:
                avg_value = -1
            tractors[mark]['models'][model][f"avg_{key}"] = avg_value
save_json('tractors_refined.json', tractors)