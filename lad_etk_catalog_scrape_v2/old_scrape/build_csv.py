import json, codecs

import json
fp = open('remaining_value.csv', 'r', encoding='utf-8')
lines = fp.readlines()[1:]
fp.close()
values = [[v.strip() for v in line.split(';')] for line in lines]
categories = [v[0] for v in values]
hours = [v[1] for v in values]
values = [v[2:] for v in values]
data = {}
for line in range(len(values)):
    for value, i in zip(values[line], range(len(values[line]))):
        category, total_hours = categories[i], hours[i]
        if (len(str(total_hours)) <= 0):
            if category not in data:
                data[category] = []
            data[category].append(float(value) / 100.0)
            continue
        if category not in data:
            data[category] = {}
        if total_hours not in data[category]:
            data[category][total_hours] = []
        data[category][total_hours].append(float(value) / 100.0)
fp = open('data_capital_recovery_tools.json', 'w', encoding='utf-8')
json.dump(data, fp, indent=4)
exit()

def read_csv(file) -> dict:
    result = {}
    with open(file, "r", encoding="utf-8") as fp:
        result = json.load(fp)
    return result

replacements = {
    'ā': 'a',
    'ē': 'e',
    'č': 'c',
    'ī': 'i',
    'ļ': 'l',
    'š': 's',
    'ū': 'u',
    'ģ': 'g',
    'ķ': 'k',
    'ž': 'z',
    'ņ': 'n',
    ' ': '_',
    '/': '_',
    ',': '',
    '\'': '',
    '.': '',
    '-': '',
    '"': '',
    '(': '',
    ')': '',
    '__': '_',
    '%': 'prc'
}
ignored = [
    'unknown',
    'numurs',
    'kategorija',
    'tehnikas_vieniba',
    'marka',
    'modelis',
    'aprikojuma_limenis',
    'cena_bez_pvn_eur'
]
combine = {
    'masa_kg': 'pilna_masa_kg',
    'tvertnes_ietilpiba_l': 'tvertnes_tilpums_l',
    'augsnes_tvertnes_ietilpiba_l': 'tvertnes_tilpums_l'
}
def clean_key(key: str) -> str:
    result = key.lower()
    for r in replacements:
        if r in result:
            result = result.replace(r, replacements[r])
    return result

def get_unique_keys(data: dict|list, unique_keys: dict = {}) -> dict:
    if isinstance(data, list):
        for item in data:
            unique_keys = get_unique_keys(item, unique_keys)
        return unique_keys
    else:
        for key in data.keys():
            cleaned = clean_key(key)
            if cleaned not in unique_keys:
                unique_keys[cleaned] = key
        
        return unique_keys

def get_unique_values(data: dict|list, key: str, unique_values: list = []) -> dict:
    if isinstance(data, list):
        for item in data:
            unique_values = get_unique_values(item, key, unique_values)
        return unique_values
    else:
        value = data[key]
        if value not in unique_values:
            if (value == 4.0):
                pass
            unique_values.append(value)
        return unique_values

catalog = read_csv("catalog_result.json")
catalog_keys = get_unique_keys(catalog, {})
metadata = read_csv("metadata_result.json")
metadata_keys = get_unique_keys([v for v in metadata.values()]), {}
with open("metadata_keys.json", "w", encoding="utf_8") as fp:
    json.dump(metadata_keys, fp, indent=4)
    fp.close()

rows = []
for row in catalog:
    result = {}
    source = row['source']
    metadata_data = metadata[source]
    for key, value in row.items():
        try:
            result[key] = float(value.replace(' ', '')) 
        except:
            result[key] = value
    
    result['metadata'] = {}
    for key, value in metadata_data.items():
        cleaned_key = clean_key(key)
        if cleaned_key in combine:
            cleaned_key = combine[cleaned_key]
        if cleaned_key in ignored:
            continue
        try:
            result['metadata'][cleaned_key] = 0 if len(value) == 0 else float(value.replace(' ', ''))  
        except:
            result['metadata'][cleaned_key] = value
    rows.append(result)

catalog_keys['metadata'] = 'Metadati (JSON)'

with open("final.json", "w", encoding="utf_8") as fp:
    json.dump(rows, fp, indent=4)
    fp.close()

with open("final.csv", "w", encoding="utf_8") as fp:
    fp.write("sep=;\n")
    fp.write(';'.join(catalog_keys)+'\n')
    for row in rows:
        fp.write(';'.join([str(v) for v in row.values()])+'\n')
    fp.close()

sql_base = "INSERT INTO uzc_gazes.technical_equipment_lad(metadata, source, price, eds_number, equipment_level, model, mark, technical_unit, category) VALUES ('%1%', '%2%', %3%, '%4%', '%5%', '%6%', '%7%', '%8%', '%9%');"
sql_map = {
    'category': '%9%', 
    'technical_unit': '%8%', 
    'mark': '%7%', 
    'model': '%6%', 
    'equipment_level': '%5%', 
    'eps_lad_number': '%4%', 
    'price': '%3%', 
    'source': '%2%', 
    'metadata': '%1%'
}

categories = [
    "Atjaunojamās enerģijas ražošana",
    "Augsnes apstrādes tehnika un iekārtas",
    "Fermu aprīkojums un iekārtas",
    "Kautuves aprīkojums",
    "Kravu celšanas un kraušanas tehnika",
    "Kravu transportēšanas tehnika",
    "Laboratorijas iekārtas",
    "Lauksaimniecības produkcijas pirmapstrādes un uzglabāšanas tehnika",
    "Lopbarības sagatavošanas tehnika",
    "Meliorācijas sistēmu kopšanas tehnika",
    "Mēslošanas un augu aizsardzības tehnika",
    "Papildaprīkojums",
    "Precīzās tehnoloģijas",
    "Ražas novākšanas tehnika",
    "Ražošanas resursu uzglabāšanas tvertnes",
    "Sējas un stādāmā tehnika",
    "Sējumu un stādījumu kopšanas tehnika",
    "Traktori"
]
final_rows = []
for row in rows:
    if row['category'] in categories:
        final_rows.append(row)
        
with open("final.sql", "w", encoding="utf-8") as fp:
    fp.write("TRUNCATE uzc_gazes.technical_equipment_lad;\n")
    for row in final_rows:
        line = str(sql_base)
        for key, value in row.items():
            if key == 'metadata':
                for k, v in value.items():
                    try:
                        value[k] = v.replace('\"', '').replace('\'', '')
                    except:
                        pass
                line = line.replace(sql_map[key], json.dumps(value).replace('\'', '"'))
            else:
                line = line.replace(sql_map[key], str(value).replace('\'', '"'))
        fp.write(line + '\n')
    fp.close()
