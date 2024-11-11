import os, json, requests, re
def open_json(file):
    data = {}
    if os.path.exists(file):
        with open(file, 'r') as fp:
            data = json.load(fp)
            fp.close()
    return data
def save_json(file, data):
    with open(file, 'w') as fp:
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