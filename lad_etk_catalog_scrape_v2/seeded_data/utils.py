import os, json, requests, re
from rapidfuzz import fuzz
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
    'ņ': 'n'
}

def normalize_text(text):
    text = text.lower()  # Convert to lowercase
    text = re.sub(r'[^\w\s]', '', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    for r in replacements:
        if r in text:
            text = text.replace(r, replacements[r])
    return text

# https://www.calculatorsoup.com/calculators/conversions/power.php zs -> kw 
def convert_zs_to_kw(zs):
    return float(zs) * 0.7457

def rapidfuzz_similarity(a: str, b: str) -> float:
    normalized_a = normalize_text(a)
    normalized_b = normalize_text(b)
    return fuzz.token_sort_ratio(normalized_a, normalized_b) / 100

def get_full_model_name(equipmentModel: EquipmentModel) -> str:
    return f"{equipmentModel.manufacturer} {equipmentModel.model}"

def models_similar(equipmentA: EquipmentModel, equipmentB: EquipmentModel, threshold: float = 0.90) -> bool:
    if equipmentA['category'] != equipmentB['category']:
        return False
    
    # Todo: Must use more information to better match, models are not enough
    similarity = rapidfuzz_similarity(get_full_model_name(equipmentA), get_full_model_name(equipmentB))
    
    return similarity >= threshold