import os, json, requests, re
from rapidfuzz import fuzz
from sentence_transformers import SentenceTransformer, util
from equipment_model import EquipmentModel
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
def avg(data):
    return sum([float(d) for d in data]) / len(data)
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
    '&': '',
    '\'': '',
    ' ': '_',
    '/': '_',
    ',': '',
    '.': '',
    '-': '',
    '"': '',
    '(': '',
    ')': '',
    '%': 'prc'
}

replacements_units = ['kg', 'lpm', 'bar', 'L', 'kW', 'cm']

def clean_key(key: str) -> str:
    result = str(key).lower()
    for r in replacements:
        if r in result:
            result = result.replace(r, replacements[r])
        if '__' in result:
            result = result.replace('__', '_')
    return result.strip()

def clean_value(value: str) -> str:
    unit = ''
    for replacement in replacements_units:
        if replacement in value:
            unit = replacement.strip().lower()
            result = value.replace(replacement, '')
    return {
        'unit': unit,
        'value': float(result.strip())
    }
current_rates = {}
def convert_to_eur(value, currency_code: str, date: str):
    global current_rates
    key = f"{currency_code}_{date}"
    if key in current_rates:
        return round(current_rates[key] * float(value), 2)
    res = requests.get(f"https://api.frankfurter.app/{date}?base={currency_code}&symbols=EUR")
    if res.status_code == 404:
        return f"{value} {currency_code}({date})"
    current_rates[key] = float(res.json()['rates']['EUR'])
    
    return round(current_rates[key] * float(value), 2)

def normalize_text(text):
    text = text.lower()  # Convert to lowercase
    text = re.sub(r'[^\w\s]', '', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    return text

def clean_currency(value):
    numerics = re.findall('([0-9,]+)', value)
    year_match = re.search('(19[0-9]{2})|(20[0-9]{2})', value)
    currency_date = 'latest' if year_match is None else f"{year_match[0]}-01-01"
    if len(numerics) <= 1 and year_match is not None:
        return -1
    if 'GBP' in value:
        return convert_to_eur(numerics[0].replace(',', ''), 'GBP', currency_date)    
    elif 'USD' in value or '$' in value:
        return convert_to_eur(numerics[0].replace(',', ''), 'USD', currency_date) 
    return value

def first_or_default(data: list, fn):
    preg = list(filter(lambda v: fn(v), data))
    if len(preg) > 0:
        return preg[0]
    return None
# https://www.calculatorsoup.com/calculators/conversions/power.php zs -> kw 
def convert_zs_to_kw(zs):
    return float(zs) * 0.7457


def rapidfuzz_similarity(a: str, b: str) -> float:
    normalized_a = normalize_text(a)
    normalized_b = normalize_text(b)
    return fuzz.token_sort_ratio(normalized_a, normalized_b) / 100

def sentence_transformer_similarity(model: SentenceTransformer, a: str, b: str) -> float:
    normalized_a = normalize_text(a)
    normalized_b = normalize_text(b)
    embedding_a = model.encode(normalized_a)
    embedding_b = model.encode(normalized_b)

    return util.cos_sim(embedding_a, embedding_b).item()

# fuzzy and sentence matching
def sentence_transformer_fuzzy_similarity(model: SentenceTransformer, a: str, b: str) -> float: 
    fuzzy_score = rapidfuzz_similarity(a, b)
    sentence_similarity = sentence_transformer_similarity(model, a, b)
    return (fuzzy_score * 0.6) + (sentence_similarity * 0.4)

def get_full_model_name(equipmentModel: EquipmentModel) -> str:
    return f"{equipmentModel['manufacturer']} {equipmentModel['model']}"

def models_similar(equipmentA: EquipmentModel, equipmentB: EquipmentModel, threshold: float = 0.90) -> bool:
    if equipmentA['category'] != equipmentB['category']:
        return False
    
    # Todo: Must use more information to better match, models are not enough
    similarity = rapidfuzz_similarity(get_full_model_name(equipmentA), get_full_model_name(equipmentB))
    
    return similarity >= threshold