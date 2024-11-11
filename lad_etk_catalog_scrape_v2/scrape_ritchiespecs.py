import requests, json, time, random, os
from utils import clean_key, save_json, open_json
def get_agriculture_equipment():
    res = requests.get('https://api.ritchiespecs.com/api/industryEquipmentManufacturer/equipment?locale=en_us&q=agriculture')
    return res.json()['response']

def get_category_models(category_slug, manufacturer_slug):
    url = f"https://api.ritchiespecs.com/api/manufacturegenericsearch"
    res = requests.post(url, {
        "locale": "en_us",
        "q": category_slug,
        "bn": manufacturer_slug,
        "defaultParams": "",
        "selectedParams": "",
        "sortItem": "",
        "sortorder": ""
    })
    return res.json()['modellist']

def get_model_details(model_slug):
    url = f"https://api.ritchiespecs.com/api/itemdetails/model?locale=en_us&q={model_slug}"
    res = requests.get(url, timeout=3)
    return res.json()

equipment_types_data = get_agriculture_equipment()
equipment_category = []
for equipment_type in equipment_types_data:
    equipment_data = {}
    type_key = clean_key(equipment_type['industryEquipment'])
    type_slug = equipment_type['subcatname_slug']
    equipment_category.append(type_key)
    if os.path.exists(f"data/ritchiespecs/{type_key}_data.json"):
        continue
    total_manufacturers = 0
    for manufacturer in equipment_type['manufacturers']:
        manufacturer_key = clean_key(manufacturer['manufacturerName'])
        model_list = get_category_models(type_slug, manufacturer['brandname_slug'])
        models = []
        for model in model_list:
            models.append({
                'model': model['modelname'],
                'slug': model['slug']
            })
        equipment_data[manufacturer_key] = {
            'manufacturer': manufacturer['manufacturerName'],
            'slug': manufacturer['brandname_slug'],
            'models': models
        }
        time.sleep(0.1 + random.random() / 10)
        print(f"Scraped {total_manufacturers + 1}/{len(equipment_type['manufacturers'])}")
        total_manufacturers += 1
    save_json(f"data/ritchiespecs/{type_key}_data.json", equipment_data)

for category in equipment_category:
    category_data = open_json(f"data/ritchiespecs/{category}_data.json")
    for manufacturer_data in category_data.values():
        total_models = 0
        
        for model in manufacturer_data['models']:
            model_slug = model['slug']
            print(f"Scraping {model_slug}...")
            if 'specifications' not in model:
                try:
                    model_data = get_model_details(model_slug)
                    specifications = []
                    if 'dimensions' in model_data:
                        specifications.extend(model_data['dimensions'])
                    if 'specifications' in model_data:
                        specifications.extend(model_data['specifications'])
                    model['specifications'] = specifications
                    time.sleep(0.1 + random.random() / 5)
                except Exception as e:
                    print(f"Failed to fetch {model_slug} model details {e}")
            print(f"{category}, {manufacturer_data['manufacturer']}- Scraped {total_models + 1}/{len(manufacturer_data['models'])}")
            total_models += 1
        print("Saving...")
        save_json(f"data/ritchiespecs/{category}_data.json", category_data)
    print("Saving...")
    save_json(f"data/ritchiespecs/{category}_data.json", category_data)
