import requests, os, time, json, random
from bs4 import BeautifulSoup, Tag, NavigableString


def request_content(url) -> str:
    response = requests.get(url)
    response.raise_for_status()
    return bytes.decode(response.content)

def get_lad_page_tables(soup: BeautifulSoup|NavigableString|Tag) -> list[NavigableString|Tag]:
    return list(soup.find_all("table", attrs={'class': 'table-colorized-rows'}))

def scrape_metadatatables(tables: list[BeautifulSoup|Tag|NavigableString], source: str) -> dict:
    result = {
        'unknown': []
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

def scrape(data, results):
    failed = []
    for i in range(len(data)):
        try:
            print(f"Scraping {i + 1}/{len(data)}...")
            
            source = data[i]['source']
            if source in results:
                continue
            time.sleep(1 + random.random() / 4)
            content = request_content(source)
            soup = BeautifulSoup(content, features="html.parser")
            metadata_tables = get_lad_page_tables(soup)
            result = scrape_metadatatables(metadata_tables, source)
            results[source] = result
            if (i % 25) == 0:
                print(f"Saving...")
                with open("metadata_result.json", "w", encoding="utf-8") as fp:
                    json.dump(results, fp, indent=4)
                    fp.close()
            
        except Exception as e:
            print(e)
            print(data[i]['source'])
            failed.append(data[i]['source'])
    return results, failed 

data = {}
if os.path.exists("catalog_result.json"):
    with open("catalog_result.json", "r", encoding="utf-8") as fp:
        data = json.load(fp)
        fp.close()
else:
    raise Exception("Run scrape_catalog.py first")

res = {}
if os.path.exists("metadata_result.json"):
    with open("metadata_result.json", "r", encoding="utf-8") as fp:
        res = json.load(fp)
        fp.close()

results, failed = scrape(data, res)

with open("metadata_result.json", "w", encoding="utf-8") as fp:
    json.dump(results, fp, indent=4)
    fp.close()