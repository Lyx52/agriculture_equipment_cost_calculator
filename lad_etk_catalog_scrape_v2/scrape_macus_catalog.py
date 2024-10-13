import requests, os, time, json, re, random, math
from bs4 import BeautifulSoup, Tag, NavigableString
from utils import clean_key, clean_value
def get_model(listing: dict) -> dict:
    info = [i.strip() for i in listing['model'].split(',')]
    return info[0]
def get_tractor_catalog(page: int) -> dict:
    result = {}
    res = requests.get(f"https://www.mascus.com/+/categorypath%3dagriculture%252ftractors/+/{page},100,relevance,search.html")
    soup = BeautifulSoup(res.content, features="html.parser")
    listing_list: Tag = soup.find('ul', attrs={'class': 'search-results'})
    result['listings'] = []
    
    for row in listing_list.find_all('li', attrs={'class': 'single-result'}):
        listing_info = {}
        price_info = row.find('div', attrs={'class': 'result-price'})
        if price_info is None:
            continue
        try:
            listing_info['price'] = float(price_info.text.lower().replace('usd', '').replace('eur', '').replace(',', '').strip())
        except:
            continue
        result_info = row.find('td', attrs={'class': 'result-info'})
        if result_info is None:
            continue
        else:
            title = result_info.find('a', attrs={'class', 'title-font'})
            listing_info['title'] = title.text
            listing_info['model'] = title['title']
            listing_info['url'] = f"https://www.mascus.com{title['href']}"
        
            details = row.find('p', attrs={'class': 'result-details'})
            children = list(details.children)
            for i in range(len(children)):
                child = children[i]
                if (type(child) is not Tag):
                    continue
                if 'class' not in child.attrs:
                    continue
                if 'fa-calendar' in child.attrs['class']:
                    listing_info['year'] = int(child.find_next_sibling('span').text)
                elif 'fa-cogs' in child.attrs['class']:
                    listing_info['motor_hours'] = float(child.next_sibling.text.replace('h', '').replace(',', '').strip())
        result['listings'].append(listing_info)
    return result
def save_listings(data):
     with open("macus_catalog_tractor.json", "w") as fp:
        data = json.dump(data, fp, indent=4)
        fp.close()
if os.path.exists('macus_catalog_tractor.json'):
    with open("macus_catalog_tractor.json", "r") as fp:
        data = json.load(fp)
        fp.close()
else:
    data = {}
    data['pages'] = {}

print("Scraping catalog...")

if 'pages' in data:
    max_page = 186
    for page in range(1, max_page + 1):
        if page not in [int(p) for p in data['pages'].keys()]:
            print(f"Scraping catalog page {page}/{max_page}...")
            listings = get_tractor_catalog(page)
            data['pages'][page] = listings['listings']
            time.sleep(0.25 + (random.random() / 2))
            save_listings(data)
    unpaged = []
    for page, value in data['pages'].items():
        unpaged.extend(value)
    save_listings(unpaged)
else:
    unpaged = data


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
            value = re.search('[0-9]+ hp', children[1].text)
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
current = 1
total = len(unpaged)
for listing in unpaged:
    print(f"Scraping {current}/{total}")
    if 'metadata' not in listing:
        url = listing['url']
        listing['metadata'] = scrape_metadata(url)
        if (current % 25) == 0:
            print('Saving...')
            save_listings(unpaged)
        time.sleep(0.2 + (random.random() / 4))
    current += 1
save_listings(unpaged)