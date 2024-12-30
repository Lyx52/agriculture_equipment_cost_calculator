from bs4 import BeautifulSoup, Tag, NavigableString
from utils import open_json, save_json
def scrape_table(table: str, source) -> dict:
    soup = BeautifulSoup(table, features="html.parser")
    params = {}
    for row in soup.find_all('tr'):
        th = row.find('th')
        td = row.find('td')
        if td is None or th is None:
            continue    
        div = td.find('div')
        if div is None:
            params[th.text.strip()] = td.text.strip()
        else:
            multi_column_items = div.find_all(attrs={'class': 'ce-multicolumn-field__item'})
            if len(multi_column_items) <= 0:
                params[th.text.strip()] = 'Jā' if div.find('title').text.strip() == 'Checkbox' else 'Nē' 
                continue
            items = []
            for item in multi_column_items:
                title = item.find('title').text.strip()
                if title == 'Radio Button On':
                    params[th.text.strip()] = item.find('label').text.strip()
                    continue    
                elif title == 'Checkbox':
                    items.append(item.find('label').text.strip())
            if len(items) > 0:
                params[th.text.strip()] = items
    return params

raw_catalog_data = open_json(f'../data/lad_catalog/raw/catalog_item_tables.json')
catalog_data = []

for source, tables in raw_catalog_data.items():
    data = {}
    for table in tables:
        data |= scrape_table(table, source)
    data['source'] = source
    catalog_data.append(data)

save_json(f'../data/lad_catalog/lad_catalog.json', catalog_data)