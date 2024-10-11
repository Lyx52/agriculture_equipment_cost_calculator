import requests, os, time, json, re, random
from bs4 import BeautifulSoup, Tag, NavigableString
from utils import clean_key, clean_value

def get_tractor_catalog() -> dict:
    result = {}
    res = requests.get("https://www.tractordata.com/farm-tractors/index.html")
    soup = BeautifulSoup(res.content, features="html.parser")
    table = soup.find('table', attrs={'class': 'tdMenu1'})
    for row in table.find_all('tr'):
        links = row.find_all('a')
        if len(links) <= 0:
            continue 
        link = links[0]
        result[clean_key(link.text)] = {
            'url': link['href'],
            'mark': link.text
        }
    return result

def get_tractors(url) -> dict:
    result = {}
    res = requests.get(url)
    soup = BeautifulSoup(res.content, features="html.parser")
    table = soup.find('table', attrs={'class': 'tdMenu1'})
    for row in table.find_all('tr'):
        links = row.find_all('a')
        if len(links) <= 0:
            continue 
        link = links[0]
        result[clean_key(link.text)] = {
            'model': link.text,
            'url': link['href']
        }
    return result
scraped_keys = [
    "fuel_tank",
    "wheelbase",
    "weight",
    "front_tire",
    "rear_tire",
    "batteries",
    "engine",
    "drawbar_tested",
    "pto_claimed",
    "pto_tested",
    "factory",
    "chassis",
    "steering",
    "brakes",
    "transmission",
    "total_flow",
    "rear_rpm",
    "original_price",
    "drawbar",
    "clutch",
    "engine_rpm",
    "2wd_wheelbase",
    "4wd_wheelbase",
    "rear_lift",
    "engine_gross",
    "transmissions",
    "engine_net"
] 
def get_tractor_metadata(url) -> dict:
    global keys
    result = {}
    res = requests.get(url)
    soup = BeautifulSoup(res.content, features="html.parser")
    metadata_containers = list(soup.find_all('div', attrs={'class': 'tdArticleItem'}))
    metadata_containers.extend(list(soup.find_all('div', attrs={'class': 'tdArticleItemFull'})))
    
    for container in metadata_containers:
        rows = container.find_all('tr')
        for row in rows:
            try:
                cells = row.find_all('td')
                if len(cells) >= 2:
                    cleaned_key = clean_key(cells[0].text).replace(':', '') 
                    if len(cleaned_key) > 0 and cleaned_key in scraped_keys:
                        cell_data = cells[1].find(attrs={'class': 'tdMt'})
                        if cell_data is None:
                            value = cells[1].text.strip()
                            result[cleaned_key] = float(value) if value.isdigit() else value 
                        else:
                            result[cleaned_key] = clean_value(cell_data.text)
            except Exception as e:
                print(e)
    return result
def save_catalog(data):
     with open("tractor_data_catalog.json", "w") as fp:
        data = json.dump(data, fp, indent=4)
        fp.close()
data = {}
if os.path.exists('tractor_data_catalog.json'):
    with open("tractor_data_catalog.json", "r") as fp:
        data = json.load(fp)
        fp.close()
else:
    print("Scraping catalog...")
    data = get_tractor_catalog()
    save_catalog(data)

current = 1
for mark, mark_data in data.items():
    if 'models' not in mark_data:
        print(f"Scraping models for {mark_data['mark']}...")
        mark_data['models'] = get_tractors(mark_data['url'])
        time.sleep(0.25 + (random.random() / 4))
        if (current % 25) == 0:
            print("Saving...")
            save_catalog(data)
    current += 1
    
save_catalog(data)

for mark, mark_data in data.items():
    current = 1
    has_scraped = False
    total_models = len(data[mark]['models'])
    print(f"Mark {mark_data['mark']} has {total_models} models...")
    for model, model_data in data[mark]['models'].items():
        print(f"Scraping metadata {current}/{total_models} for {mark_data['mark']} {model_data['model']}...")
        if 'metadata' not in model_data:
            has_scraped = True
            model_data['metadata'] = get_tractor_metadata(model_data['url'])
            time.sleep(0.25 + (random.random() / 4))
            if (current % 25) == 0:
                print("Saving...")
                save_catalog(data)
        current += 1
    if has_scraped:
        save_catalog(data)
        time.sleep(random.random() * 5)
save_catalog(data)
exit()