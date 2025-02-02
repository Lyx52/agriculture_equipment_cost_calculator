import requests, time, json, os

def fetch_model_specs(slug):
    url = f"https://api.ritchiespecs.com/api/itemdetails/model?locale=en_us&q={slug}"
    res = requests.get(url, timeout=5)
    if res.status_code != 200:
        raise Exception(f"Failed to fetch model specs {slug}")
    return res.json()

def fetch_category_manufacturers():
    url = "https://api.ritchiespecs.com/api/industryEquipmentManufacturer/equipment?locale=en_us&q=agriculture"
    res = requests.get(url)
    if res.status_code != 200:
        raise Exception(f"Failed to fetch category manufacturers")
    return res.json()["response"]

def fetch_manufacturer_models(manufacturer_slug, category_slug):
    payload = {
        "locale": "en_us",
        "q": category_slug,
        "bn": manufacturer_slug,
        "sortItem": "",
        "sortorder": "",
        "selectedParams": "",
        "defaultParams": ""
    }
    url = " https://api.ritchiespecs.com/api/manufacturegenericsearch"
    res = requests.post(url, payload)

    if res.status_code != 200:
        raise Exception(f"Failed to fetch manufacturer models")
    
    return res.json()["modellist"]

def save_json(file, data):
    with open(file, 'w', encoding="UTF-8") as fp:
        json.dump(data, fp, indent=4)
        fp.close()

def open_json(file):
    data = {}
    if os.path.exists(file):
        with open(file, 'r', encoding="UTF-8") as fp:
            data = json.load(fp)
            fp.close()
    return data

if __name__ == "__main__":
    path_to_richietech_data = "../data/richietech"
    if not os.path.exists(path_to_richietech_data):
        os.makedirs(path_to_richietech_data)

    if os.path.exists(f"{path_to_richietech_data}/specifications.json"):
        categories = open_json(f"{path_to_richietech_data}/specifications.json")
    else:
        categories = fetch_category_manufacturers()

    for category in categories:
        category_slug = category["subcatname_slug"]
        for manufacturer in category["manufacturers"]:
            manufacturer_slug = manufacturer["brandname_slug"]
            print(f"Fetching {category_slug} - {manufacturer_slug} models")
            if "models" not in manufacturer:
                manufacturer["models"] = fetch_manufacturer_models(manufacturer_slug, category_slug)
            i = 1
            for model in manufacturer["models"]:
                model_slug = model["slug"]
                print(f"{manufacturer_slug} - {model_slug} {i}/{len(manufacturer["models"])}")
                i += 1
                if "specifications" in model:
                    continue
                if "list" in model:
                    del model["list"]
                if "checked" in model:
                    del model["checked"]
                try:
                    specs = fetch_model_specs(model_slug)
                except Exception as e:
                    print(e)
                    continue
                model["specifications"] = specs["specifications"]
                model["dimensions"] = specs["dimensions"]
                time.sleep(0.25)
            save_json(f"{path_to_richietech_data}/specifications.json", categories)