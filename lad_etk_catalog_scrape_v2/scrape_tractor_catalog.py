import requests, os, time, json, re, random
from bs4 import BeautifulSoup, Tag, NavigableString
from utils import clean_key, clean_value, normalize_text

def get_tractordata_table(url: str) -> BeautifulSoup:
    res = requests.get(url)
    soup = BeautifulSoup(res.content, features="html.parser")
    return soup.find('table', attrs={'class': 'tdMenu1'})

def get_tractordata_body(url: str) -> BeautifulSoup:
    res = requests.get(url)
    soup = BeautifulSoup(res.content, features="html.parser")
    return soup.find('div', attrs={'class': 'tdPageBody'})
def parse_tractordata_manufacturers_table(table: BeautifulSoup) -> list[dict]:
    manufacturers = []
    for tr in table.find_all('tr'):
        cells = tr.find_all('td')
        link = cells[0].find('a')
        years = cells[2].find('a').text.strip()
        if len(years) <= 0:
            continue
        
        manufacturer_year_range = list(map(lambda i: int(i), years.split('-')))
        if len(manufacturer_year_range) <= 0:
            continue
        # Skip manufacturers that stopped releasing in <= 1960s
        if len(manufacturer_year_range) >= 2 and manufacturer_year_range[1] <= 1960:
            continue
        if link.text.strip() in ['Deere']:
            continue
        manufacturers.append({
            'years': manufacturer_year_range,
            'link': link.attrs['href'],
            'manufacturer': link.text.strip()
        })
    return manufacturers

def parse_tractordata_models_table(table: BeautifulSoup) -> list[dict]:
    models = []
    for tr in table.find_all('tr')[1:]:
        cells = tr.find_all('td')
        link = cells[0].find('a')
        if link is None:
            print(tr)
            continue
        models.append({
            'link': link.attrs['href'],
            'model': link.text.strip()
        })
    return models

manufacturer_table = None
if os.path.exists('data/tractordata/raw/all_tractors.html'):
    with open('data/tractordata/raw/all_tractors.html', 'r', encoding='UTF-8') as fp:
        manufacturer_table = BeautifulSoup(fp.read(), features="html.parser")
else:
    manufacturer_table = get_tractordata_table("https://www.tractordata.com/farm-tractors/index.html")
    with open('data/tractordata/raw/all_tractors.html', 'w', encoding='UTF-8') as fp:
        fp.write(manufacturer_table.prettify())

manufacturers = parse_tractordata_manufacturers_table(manufacturer_table)
print(list(map(lambda i: i['manufacturer'], manufacturers)))
for manufacturer_data in manufacturers:
    manufacturer = manufacturer_data['manufacturer']
    location = f"data/tractordata/raw/{normalize_text(manufacturer).replace(' ', '_')}"
    if not os.path.exists(location):
        os.mkdir(location)
    
    print(f"Scraping {manufacturer} model table...")
    models_table = None
    if os.path.exists(f"{location}/all_models.html"):
        with open(f"{location}/all_models.html", 'r', encoding='UTF-8') as fp:
            models_table = BeautifulSoup(fp.read(), features="html.parser")
    else:
        models_table = get_tractordata_table(manufacturer_data['link'])
        with open(f"{location}/all_models.html", 'w', encoding='UTF-8') as fp:
            fp.write(models_table.prettify())
    models = parse_tractordata_models_table(models_table)
    counter = 1
    for model_data in models:
        model = model_data['model']
        model_location = f"{location}/{normalize_text(model).replace(' ', '_')}.html"
        print(f"Scraping {model}, {counter}/{len(models)}")
        if not os.path.exists(model_location):
            model_page_body = get_tractordata_body(model_data['link'])
            with open(model_location, 'w', encoding='UTF-8') as fp:
                fp.write(model_page_body.prettify())
            time.sleep(0.5 + random.random() / 4)
        counter += 1
# def get_tractors(url) -> dict:
#     result = {}
#     res = requests.get(url)
#     soup = BeautifulSoup(res.content, features="html.parser")
#     table = soup.find('table', attrs={'class': 'tdMenu1'})
#     skipFirst = True
#     for row in table.find_all('tr'):
#         if skipFirst:
#             skipFirst = False
#             continue
#         cells = row.find_all('td')
#         if len(cells) < 3:
#             continue
#         link = cells[0].find('a')
#         model_key = clean_key(link.text)
#         result[model_key] = {
#             'url': link['href'],
#             'model': link.text
#         }
#         try:
#             power = re.search('[0-9]+ hp', cells[1].text)
#             if power is not None:
#                 result[model_key]['power'] = power[0].replace('hp', '').strip()
#         except Exception as e:
#             print(e)
#         try:
#             if 'unknown' in cells[2].text.lower():
#                 continue
#             result[model_key]['year_range'] = list(filter(lambda v: len(str(v)) >= 4, [int(y) if len(y) > 0 else 0 for y in cells[2].text.split('-')]))
#         except Exception as e:
#             print(e)
#     return result
# def get_tractor_metadata(url) -> dict:
#     global keys
#     result = {}
#     res = requests.get(url)
#     soup = BeautifulSoup(res.content, features="html.parser")
#     metadata_containers = list(soup.find_all('div', attrs={'class': 'tdArticleItem'}))
#     metadata_containers.extend(list(soup.find_all('div', attrs={'class': 'tdArticleItemFull'})))
    
#     for container in metadata_containers:
#         rows = container.find_all('tr')
#         for row in rows:
#             try:
#                 cells = row.find_all('td')
#                 if len(cells) >= 2:
#                     cleaned_key = clean_key(cells[0].text).replace(':', '') 
#                     if len(cleaned_key) > 0:
#                         cell_data = cells[1].find(attrs={'class': 'tdMt'})
#                         if cell_data is None:
#                             value = cells[1].text.strip()
#                             result[cleaned_key] = float(value) if value.isdigit() else value 
#                         else:
#                             result[cleaned_key] = clean_value(cell_data.text)
#             except Exception as e:
#                 print(e)
#     return result
# def save_catalog(data):
#      with open("data/tractordata/tractor_data_catalog.json", "w") as fp:
#         data = json.dump(data, fp, indent=4)
#         fp.close()

# data = {}
# if os.path.exists('data/tractordata/tractor_data_catalog.json'):
#     with open("data/tractordata/tractor_data_catalog.json", "r") as fp:
#         data = json.load(fp)
#         fp.close()
# else:
#     print("Scraping catalog...")
#     data = get_tractor_catalog()
#     save_catalog(data)

# current = 1
# for mark, mark_data in data.items():
#     if 'models' not in mark_data:
#         print(f"Scraping models for {mark_data['mark']}...")
#         mark_data['models'] = get_tractors(mark_data['url'])
#         time.sleep(0.25 + (random.random() / 4))
#         if (current % 25) == 0:
#             print("Saving...")
#             save_catalog(data)
#     current += 1
# save_catalog(data)

# for mark, mark_data in data.items():
#     current = 1
#     has_scraped = False
#     total_models = len(data[mark]['models'])
#     print(f"Mark {mark_data['mark']} has {total_models} models...")
#     for model, model_data in data[mark]['models'].items():
#         print(f"Scraping metadata {current}/{total_models} for {mark_data['mark']} {model_data['model']}...")
#         if 'metadata' not in model_data:
#             has_scraped = True
#             model_data['metadata'] = get_tractor_metadata(model_data['url'])
#             time.sleep(0.2 + (random.random() / 8))
#             if (current % 25) == 0:
#                 print("Saving...")
#                 save_catalog(data)
#         current += 1
#     if has_scraped:
#         save_catalog(data)
#         time.sleep(random.random() * 1.5)
# save_catalog(data)