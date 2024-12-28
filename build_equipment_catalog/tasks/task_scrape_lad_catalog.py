import requests, os, time, json, random
from bs4 import BeautifulSoup, Tag, NavigableString
path_to_temp_data = "../data/lad_catalog"
path_to_raw_data = f"{path_to_temp_data}/raw"
path_to_raw_pages = f"{path_to_raw_data}/pages"
if not os.path.exists(path_to_raw_pages):
    os.makedirs(path_to_raw_pages)

    
base_url = "https://eps.lad.gov.lv"
catalog_url = f"{base_url}/etk_public"
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
def get_lad_catalog_table(page: int) -> NavigableString|Tag:
    res = requests.get(f"{catalog_url}?page={page}")
    soup = BeautifulSoup(res.content, features="html.parser")
    return soup.find("table", attrs={'class': 'table-colorized-rows'})

def get_lad_catalog_page_count() -> int:
    res = requests.get(catalog_url)
    soup = BeautifulSoup(res.content, features="html.parser")
    paginate_links = soup.find("div", attrs={'id': 'content_inner'}).find('div', attrs={'class': 'pagination'}).find_all('a')
    max_page = max(list(map(lambda a: int(a.text), filter(lambda a: a.text.isdigit(), paginate_links))))
    return max_page

def scrape_lad_page_table(soup: BeautifulSoup|NavigableString|Tag) -> list[dict]:
    rows = []
    for row in soup.find("tbody").find_all("tr"):
        columns = row.find_all("td")
        equipment_data = {
            'category': columns[0].text.strip(),
            'technical_unit': columns[1].text.strip(),
            'mark': columns[2].text.strip(),
            'model': columns[3].text.strip(),
            'equipment_level': columns[4].text.strip(),
            'eps_lad_number': columns[5].text.strip(),
            'price': columns[6].text.strip(),
            'source': f"{base_url}{columns[5].find('a')['href']}"
        }
        rows.append(equipment_data)
    return rows

def get_lad_page_tables(url: str) -> list[NavigableString|Tag]:
    res = requests.get(url)
    soup = BeautifulSoup(res.content, features="html.parser")
    return list(soup.find_all("table", attrs={'class': 'table-colorized-rows'}))

def scrape_metadatatables(tables: list[BeautifulSoup|Tag|NavigableString], source: str) -> dict:
    result = {
        'unknown': [],
        'source': source
    }
    for table in tables:
        for row in table.find_all("tr"):
            try:
                th = row.find("th")
                td = row.find("td")
                if td is None:
                    continue
                
                if th is None:
                    result['unknown'].append(td)
                name = th.text.strip()
                multi_column_items = td.find_all(attrs={'class': 'ce-multicolumn-field__item'})
                if len(multi_column_items) == 0:
                    result[name] = td.text.strip()
                else:
                    for item in multi_column_items:
                        label = item.find(attrs={'class': 'ionic-icon__label'})
                        value = item.find(attrs={'class': 'ionic-icon'})
                        if 'checkbox' in value.text.strip().lower():
                            if name not in result:
                                result[name] = []
                            result[name].append(label.text.strip())
                        elif 'on' in value.text.strip().lower():
                             result[name] = label.text.strip()
                    if name not in result:
                        result[name] = multi_column_items.text.strip()   
            except:
                print(f"{source} -> {row}")
        
    return result

max_pages = get_lad_catalog_page_count()
catalog_table_data = []
for page in range(1, max_pages + 1):
    table = None
    if not os.path.exists(f"{path_to_raw_pages}/page_{page}_table.html"):
        table = get_lad_catalog_table(page)
        with open(f"{path_to_raw_pages}/page_{page}_table.html", "w", encoding="UTF-8") as fp:
            fp.write(table.prettify())
            fp.close()
        time.sleep(0.1 + random.random() / 8)
    else:
        with open(f"{path_to_raw_pages}/page_{page}_table.html", "r", encoding="UTF-8") as fp:
            table = BeautifulSoup(fp.read(), features="html.parser")
    print(f"Page {page}/{max_pages}...")
    catalog_table_data.extend(scrape_lad_page_table(table))
raw_catalog_data = {}
total_item_count = 0
if os.path.exists(f'{path_to_raw_data}/catalog_item_tables.json'):
    raw_catalog_data = open_json(f'{path_to_raw_data}/catalog_item_tables.json')

for item in catalog_table_data:
    if item['source'] not in raw_catalog_data:
        raw_catalog_data[item['source']] = list(map(lambda t: t.prettify(), get_lad_page_tables(item['source'])))
        time.sleep(0.1 + random.random() / 8)
        if (total_item_count % 25) == 0:
            print(f"Saving... {total_item_count}")
            save_json(f'{path_to_raw_data}/catalog_item_tables.json', raw_catalog_data)
    total_item_count += 1

save_json(f'{path_to_raw_data}/catalog_item_tables.json', raw_catalog_data)
catalog_data = []
for source, tables in raw_catalog_data.items():
    bs_tables = list(map(lambda table: BeautifulSoup(table, features="html.parser"), tables))
    catalog_data.append(scrape_metadatatables(bs_tables, source))

save_json(f'{path_to_temp_data}/lad_catalog.json', catalog_data)