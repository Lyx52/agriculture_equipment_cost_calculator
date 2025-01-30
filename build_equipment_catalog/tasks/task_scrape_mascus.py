import json, os, requests, time, math
url = "https://qhqraq9hm7.execute-api.eu-central-1.amazonaws.com/Search/SearchAssets"
items_per_page = 500
categories = [
  "tractors",
  "agriharvesters",
  "siena-novaksanas-un-lopbaribas-sagatavosanas-tehnika",
  "augsnes-apstrades-tehnika",
  "sejmasinas-un-stadamas-masinas",
  "lopkopibas-iekartas",
  "meslosanas-aprikojums",
  "miglotaji",
  "labibas-apstrades-un-uzglabasanas-iekartas",
  "kartupelu-tehnika",
  "lopbaribas-novaceji-(pasgajeji)-lauksaimnieciba"
]

payload = {
  "catalogs":[
    "agriculture"
  ],
  "categories": [],
  "page": 1,
  "pagesize": items_per_page,
  "usercurrency":"EUR"
}

def open_json(file):
    data = {}
    if os.path.exists(file):
        with open(file, 'r', encoding="UTF-8") as fp:
            data = json.load(fp)
            fp.close()
    return data
def save_json(file, data):
    with open(file, 'w', encoding="UTF-8") as fp:
        json.dump(data, fp, indent=4)
        fp.close()

def fetch_listings(page, max_per_page=items_per_page):
    payload["page"] = page
    payload["pagesize"] = max_per_page
    res = requests.post(url, json=payload, headers={
        "Content-Type": "application/json",
        "Origin": "https://www.mascus.lv",
        "Hostname": "www.mascus.lv",
    })
    if res.status_code != 200:
      print(f"Failed mascus fetch {res.text} {res.status_code} {payload}!")
      return {}
    
    return res.json()

if __name__ == "__main__":
    path_to_mascus_data = "../data/mascus"
    if not os.path.exists(path_to_mascus_data):
        os.makedirs(path_to_mascus_data)
    results = {
       "listings": [],
       "scraped_pages": 0
    }
    if os.path.exists(f"{path_to_mascus_data}/mascus.json"):
      results = open_json(f"{path_to_mascus_data}/mascus.json")
    page = 1
    data = fetch_listings(page)
    totalResults = data['totalResults']
    results["listings"].extend(data["items"])

    max_pages = math.floor(totalResults / items_per_page)
    if max_pages <= results['scraped_pages']:
       exit(0)  
    for page in range(results['scraped_pages'] + 1, max_pages + 1):
      time.sleep(0.4)
      print(f"{page}/{max_pages}...")
      data = fetch_listings(page)
      results["listings"].extend(data["items"])
      results['scraped_pages'] = page
      if (page % 25) == 0:
         print(f"Saving...")
         save_json(f"{path_to_mascus_data}/mascus.json", results)
    
    data = fetch_listings(max_pages + 1, totalResults - (max_pages * items_per_page))
    results["listings"].extend(data["items"])
    print(f"Saving...")
    save_json(f"{path_to_mascus_data}/mascus.json", results)