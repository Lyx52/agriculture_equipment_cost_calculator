import requests, os, time, json
from bs4 import BeautifulSoup, Tag, NavigableString

base_url = "https://eps.lad.gov.lv"
catalog_url = f"{base_url}/etk_public"
max_page = 196

def request_lad_page(page: int) -> str:
    url = f"{catalog_url}?page={page}"
    response = requests.get(url)
    response.raise_for_status()
    return bytes.decode(response.content)
    
def get_lad_page_table(soup: BeautifulSoup|NavigableString|Tag) -> NavigableString|Tag:
    return soup.find("table", attrs={'class': 'table-colorized-rows'})

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

def scrape(pages: list[int]):
    
    data = []
    failed = []
    for page in pages:
        try:
            print(f"Scraping {page}/{max_page}...")
            content = request_lad_page(page)
            soup = BeautifulSoup(content, features="html.parser")
            table = get_lad_page_table(soup)
            equipment_data = scrape_lad_page_table(table)
            data.extend(equipment_data)
            time.sleep(0.1)
        except Exception as e:
            print(e)
            failed.append(page)
    return data, failed

data = {}
if os.path.exists("catalog_result.json"):
    with open("catalog_result.json", "r", encoding="utf-8") as fp:
        data = json.load(fp)
        fp.close()
else:
    data, failed = scrape(range(1, max_page + 1))

    with open("catalog_result.json", "w", encoding="utf-8") as fp:
        json.dump(data, fp, indent=4)
        fp.close()