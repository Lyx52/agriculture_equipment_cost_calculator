import requests, os
from bs4 import BeautifulSoup
from utils import clean_key

def get_tractor_catalog() -> dict:
    result = {}
    if os.path.exists("data/heavyequipmentspecs/raw/all_table.html"):
        with open("data/heavyequipmentspecs/raw/all_table.html", "r", encoding="UTF-8") as fp:
            table = BeautifulSoup(fp.read(), features="html.parser")
    else:
        res = requests.get("https://www.heavyequipmentspecs.com/tractors")
        soup = BeautifulSoup(res.content, features="html.parser")
        container = soup.find('div', attrs={'id': 'allManufacturers'})
        table = container.find("table")
        with open("data/heavyequipmentspecs/raw/all_table.html", "w", encoding="UTF-8") as fp:
            fp.write(table.prettify())
    print(table)
    return result
print(get_tractor_catalog())