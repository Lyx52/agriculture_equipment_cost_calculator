from selenium import webdriver
from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By
import json, math, time, os, random
from utils import clean_key, open_json, save_json, normalize_text, rapidfuzz_similarity
from bs4 import BeautifulSoup, Tag, NavigableString
def get_lecture_specs_list(driver: Chrome, category: int, page: int) -> dict:
    driver.get(f"https://www.lectura-specs.com/en/xhr/models?data[lang]=1&data[category]={category}&data[filter][year][from]=1990&data[filter][year][to]=2024&data[page]={page}")
    preElement = driver.find_element(By.TAG_NAME, 'pre')
    return json.loads(preElement.text)
sub_categories = {
    984763: 'tractor_4x2',
    984764: 'tractor_4x4',
    986441: 'plough',
    986402: 'cultivator',
    985652: 'packing_press',
    985594: 'balling_press',
    986403: 'seed_drill'
}
def save_raw(category_code, page, res):
    if not os.path.exists(f"data/lectura_specs/raw/{category_code}"):
        os.mkdir(f"data/lectura_specs/raw/{category_code}")
    with open(f"data/lectura_specs/raw/{category_code}/page_{page}.json", "w", encoding="UTF-8") as fp:
        json.dump(res, fp, indent=4)
        fp.close()

def get_specification_table(driver: Chrome, url: str) -> NavigableString|Tag:
    driver.implicitly_wait(1)
    driver.get(f"https://www.lectura-specs.com{url}")
    driver.find_element(By.CLASS_NAME, "c-term-list")
    soup = BeautifulSoup(driver.page_source, features="html.parser")
    termList = soup.find("div", attrs={'class': 'c-term-list'})
    return termList.prettify()


# for category_id, key in sub_categories.items():
#     res = get_lecture_specs_list(driver, category_id, 1)
#     save_raw(key, 1, res)
#     pages = math.ceil(int(res['count']) / 32)
#     time.sleep(0.5)
#     for page in range(2, pages + 1):
#         if not os.path.exists(f"data/lectura_specs/raw/{key}/page_{page}.json"):
#             res = get_lecture_specs_list(driver, category_id, page)
#             save_raw(key, page, res)
#             time.sleep(0.5 + random.random() / 4)
#         print(f"{key} pages ({page}/{pages})")
scraped_item_data = {}
if os.path.exists("data/lectura_specs/raw/tables.json"):
    scraped_item_data = open_json("data/lectura_specs/raw/tables.json")


lad_catalog = open_json("lad_catalog_data.json")
wanted_manufacturers = list(set([clean_key(item['manufacturer']) for item in lad_catalog]))
for category_id, key in sub_categories.items():
    for json_file in os.listdir(f"data/lectura_specs/raw/{key}"):
        data = open_json(f"data/lectura_specs/raw/{key}/{json_file}")
        total = len(data['result'])
        current = 1
        for item in data['result']:
            final_link = item['final_link']
            manufacturer = clean_key(item['manufacturer_name'])
            if manufacturer not in wanted_manufacturers:
                current += 1
                continue
            if not final_link in scraped_item_data:
                try:
                    driver = webdriver.Chrome()
                    scraped_item_data[final_link] = {
                        "table": get_specification_table(driver, final_link),
                        "item": item,
                        "sub_category": key
                    }
                    driver.quit()
                except Exception as e:
                    print(e)
                    continue
            if (current % 10) == 0:
                save_json("data/lectura_specs/raw/tables.json", scraped_item_data)
            print(f"{json_file}, {current}/{total}...")
            current += 1
save_json("data/lectura_specs/raw/tables.json", scraped_item_data)

