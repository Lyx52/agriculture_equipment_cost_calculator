import json, requests, os

def get_last_path_segment(seo_url: str) -> str:
    parts = [p for p in seo_url.split('/') if p]
    return parts[-1] if parts else ""

def parse_categories(categories_list, result_map):
    for category in categories_list:
        category_name = category.get("categoryName")
        seo_url = category.get("seoUrl", "")
        if category_name and seo_url:
            last_path = get_last_path_segment(seo_url)
            result_map[category_name] = last_path

        children = category.get("children", [])
        if children:
            parse_categories(children, result_map)

def save_json(file, data):
    with open(file, 'w', encoding="UTF-8") as fp:
        json.dump(data, fp, indent=4)
        fp.close()
if __name__ == "__main__":
    result_map = {}
    res = requests.get("https://qhqraq9hm7.execute-api.eu-central-1.amazonaws.com/Taxonomy/GetTree", headers={
        "Origin": "https://www.mascus.lv",
        "Hostname": "www.mascus.lv",
    })
    if res.status_code != 200:
        print("Failed to build mascus category map")
        exit(1)
    data = res.json()
    top_categories = data.get("categories", [])

    parse_categories(top_categories, result_map)
    path_to_mascus_data = "../data/mascus"
    if not os.path.exists(path_to_mascus_data):
        os.makedirs(path_to_mascus_data)
    save_json(f"{path_to_mascus_data}/mascus_category_map.json", result_map)