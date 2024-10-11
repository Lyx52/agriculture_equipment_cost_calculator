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
analytics = {}
for listing in unpaged:
    if 'motor_hours' not in listing:
        continue
    cleaned_model = clean_key(get_model(listing))
    if cleaned_model not in analytics:
        analytics[cleaned_model] = {
            'data': {},
            'model': get_model(listing)
        }

    analytics[cleaned_model]['data'][listing['motor_hours']] = listing['price']
for key, value in analytics.items():
    value['avg_price'] = sum(value['data'].values()) / len(value['data'])
    value['avg_motor_hours'] = sum(value['data'].keys()) / len(value['data'])
with open("macus_analytics.json", "w") as fp:
    json.dump(analytics, fp, indent=4)
    fp.close()
