import re, json, os
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

def open_csv(file, sep=';'):
    fs = open(file, 'r', encoding='utf-8')
    data = list(map(lambda row: row.split(sep),fs.readlines()))
    fs.close()
    return data

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
    return round(float(zs) * 0.7457, 2)

class EquipmentModel:
    def __init__(self, manufacturer, model, price, equipment_type_code, specifications):
        self.model = model
        self.manufacturer = manufacturer
        self.price = price
        self.specifications = specifications
        self.equipment_type_code = equipment_type_code

    def to_dict(self):
        return {
            "Model": self.model,
            "Manufacturer": self.manufacturer,
            "Price": self.price,
            "EquipmentTypeCode": self.equipment_type_code,
            "Specifications": self.specifications
        }