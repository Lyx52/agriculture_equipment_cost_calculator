import os, json
from utils import clean_key, convert_to_eur, save_json
import requests, os, time, json, re, random, math
from bs4 import BeautifulSoup, Tag, NavigableString
json_files = list(filter(lambda f: str(f).endswith('.json'), os.listdir('./mascus')))
all_data = []
for file in json_files:
    all_data.extend(json.load(open(f"./mascus/{file}")))

with open('macus_data.json', 'w', encoding='utf-8') as fp:
    json.dump(all_data, fp, indent=4)
    fp.close()

def scrape_metadata(url):
    result = {
        'unsorted_metadata': {}
    }
    res = requests.get(url)
    soup = BeautifulSoup(res.content, features="html.parser")
    for row in soup.find_all('tr'):
        name_cell = row.find('td', attrs={'class': 'name'})
        if name_cell is None:
            continue
        
        children = list(name_cell.children)
        if len(children) < 2:
            continue
        name = clean_key(children[0])
        if name == 'engine_power':
            value = re.search('[0-9.]+ hp', children[1].text)
            if value is None:
                continue
            value = float(value[0].lower().replace('hp', '').strip())
            result[name] = value 
        elif name == 'brand__model':
            result['model'] = children[1].text
        elif name not in result['unsorted_metadata']:
            try:
                result['unsorted_metadata'][name] = children[1].text     
            except:
                continue
    return result

# Need to rescrape these because hp was scraped wrong...
need_to_rescrape = list(filter(lambda v: 'engine_power' in v['metadata'] and v['metadata']['engine_power'] < 40, all_data))
rest = list(filter(lambda v: 'engine_power' not in v['metadata'] or ('engine_power' in v['metadata'] and v['metadata']['engine_power'] >= 40), all_data))
print(len(need_to_rescrape))
print(len(rest))
print(len(all_data))
current = 1
total = len(need_to_rescrape)
for listing in need_to_rescrape:
    print(f"Scraping {current}/{total}")
    url = listing['url']
    listing['metadata'] = scrape_metadata(url)
    if (current % 25) == 0:
        print('Saving...')
        save_json('macus_data_fixed.json', rest)
    rest.append(listing)
    time.sleep(0.2 + (random.random() / 4))
    current += 1
