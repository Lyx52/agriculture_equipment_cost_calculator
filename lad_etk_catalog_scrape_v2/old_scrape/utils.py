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

class LadCatalog:
    def __init__(self, json_file, marks):
        self.marks = marks
        self.data = open_json(json_file)
        self.convert_categories = {
            'traktori': 'tractors',
            'sejas_un_stadama_tehnika': 'sowing_and_planting_machines',
            'augsnes_apstrades_tehnika_un_iekartas': 'tillage_machines',
            'razas_novaksanas_tehnika': 'agricultural_harvesters',
            'lopbaribas_sagatavosanas_tehnika': 'hay_and_forage_machines',
            'meslosanas_un_augu_aizsardzibas_tehnika': 'fertilization_and_plant_protection_machines',
            'kravu_transportesanas_tehnika': 'cargo_transportation_machines',
            'sejumu_un_stadijumu_kopsanas_tehnika': 'sowing_and_plant_care_machines',
        }
        self.convert_sub_categories = {
            'lauksaimniecibas_traktors': 'agriculture_tractor',
            'piekabe': 'trailer',
            'mulceris': 'forage_harvester',
            'sejmasina': 'drills',
            'arkls': 'plough',
            'graudaugu_kombains': 'combine_harvester',
            'kartupelu_novaksanas_kombains': 'potato_harvester',
            'mehaniskais_skirotajs': 'mechanical_sorter',
            'plaujmasina': 'mowers',
            'smidzinatajs': 'sprayer',
            'skidrmeslu_cisterna': 'liquid_manure_tank',
            'universalais_transportlidzeklis': 'universal_transport',
            'specializetais_kravas_furgons': 'specialized_cargo_transport',
            'piena_parvadasanas_tehnika': 'milk_cargo_transport',
            'graudu_parvadasanas_tehnika': 'grain_cargo_transport',
            'generators': 'generator',
            'kultivators': 'cultivators',
            'freze': 'mills',
            'skeldotajs': 'chipper',
            'rindstarpu_kultivators': 'row_cultivator',
            'maurina_plaujmasina': 'grass_mower',
            'kartupelu_vagotajs': 'potato_furrower'
        }
        self.specification_values = {
            'dzinejs_jauda_zs': lambda v: float(v) * 0.7457,
            'nepieciesama_maksimala_traktora_jauda_zs': lambda v: float(v) * 0.7457,
            'nepieciesama_traktora_jauda_zs': lambda v: float(v) * 0.7457,
            'maksimala_motora_jauda_zs': lambda v: float(v) * 0.7457,
            'motora_maksimala_jauda_zs': lambda v: float(v) * 0.7457,
            'nepieciesamie_traktora_parametri_jauda_zs': lambda v: float(v) * 0.7457,
            'motora_jauda_zs': lambda v: float(v) * 0.7457,
            'nepieciesama_maksimala_traktora_pasa_jauda_zs': lambda v: float(v) * 0.7457,
            'gabariti_mm_augstums': lambda v: float(v) / 10,
            'gabariti_mm_garums': lambda v: float(v) / 10,
            'gabariti_mm_platums': lambda v: float(v) / 10,
            'izmeri_mm_garums': lambda v: float(v) / 10,
            'izmeri_mm_platums': lambda v: float(v) / 10,
            'izmeri_mm_augstums': lambda v: float(v) / 10,
            'izmeri_platums_mm': lambda v: float(v) / 10,
            'izmeri_garums_mm': lambda v: float(v) / 10,
            'izmeri_augstums_mm': lambda v: float(v) / 10,
            'iekartas_izmeri_mm_platums': lambda v: float(v) / 10,
            'iekartas_izmeri_mm_garums': lambda v: float(v) / 10,
            'iekartas_izmeri_mm_augstums': lambda v: float(v) / 10,
            'diametrs_mm': lambda v: float(v) / 10,
            'platums_mm': lambda v: float(v) / 10,
            'garums_mm': lambda v: float(v) / 10,
            'augstums_mm': lambda v: float(v) / 10,
            'zavesanas_paplasu_izmeri_mm_platums': lambda v: float(v) / 10,
            'zavesanas_paplasu_izmeri_mm_garums': lambda v: float(v) / 10,
            'darba_platums_cm': lambda v: float(v) / 100,
            'kravnesiba_kg': lambda v: float(v) / 1000,
            'tvertnes_ietilpiba_kg': lambda v: float(v) / 1000,
            'sastava_pilna_masa_t': lambda v: float(v) * 1000,
            'izmeri_mm_diametrs': lambda v: float(v) / 10,
            'parametri_raziba_m3_min': lambda v: float(v) * 60,
            'maksimala_gaisa_plusma_m3_min': lambda v: float(v) * 60,
            'maksimala_jauda_w': lambda v: float(v) / 1000,
            'suksanas_jauda_l_min': lambda v: float(v) / 60,
            'plausanas_platums_cm': lambda v: float(v) / 100,
        }
        self.convert_specification_key = {
            'dzinejs_jauda_zs': 'power',
            'iekartas_jauda_kw': 'power',
            'maksimala_motora_jauda_zs': 'power',
            'motora_maksimala_jauda_zs': 'power',
            'motora_jauda_zs': 'power',
            'nominala_jauda_kw': 'power',
            'jauda_kw': 'power',
            'maksimala_jauda_w': 'power',
            'motora_jauda_kw': 'power',
            'vilceja_dzinejs_jauda_kw': 'power',
            'motora_jauda': 'power',
            'elektromotora_jauda_kw': 'power',
            'kopeja_nominala_jauda_kw': 'power',
            'elektriska_jauda_kw': 'power',
            'jauda_w': 'power',
            'transportiera_jauda_kw': 'power',
            'nepieciesama_maksimala_traktora_jauda_zs': 'required_power',
            'nepieciesama_traktora_jauda_zs': 'required_power',
            'velama_traktora_jauda_zs': 'required_power',
            'nepieciesamie_traktora_parametri_jauda_zs': 'required_power',
            'nepieciesama_maksimala_traktora_pasa_jauda_zs': 'required_power',
            'nepieciesama_agregatesanas_jauda_kw': 'required_power',
            'piedzinas_jauda_kw': 'required_power',
            'nepieciesama_kopeja_jauda_kw': 'required_power',
            'nepieciesama_piedzinas_jauda_kw': 'required_power',
            'nepieciesama_elektriska_jauda_kw': 'required_power',
            'izmeri_m_garums': 'length',
            'izmeri_m_platums': 'width',
            'izmeri_m_augstums': 'height',
            'izmeri_augstums_m': 'height',
            'izmeri_platums_m': 'width',
            'izmeri_garums_m': 'length',
            'gabariti_m_augstums': 'height',
            'gabariti_m_platums': 'width',
            'gabariti_m_garums': 'length',
            'transportiera_kopgarums_m': 'length',
            'gabariti_mm_augstums': 'height_cm',
            'gabariti_mm_garums': 'length_cm',
            'gabariti_mm_platums': 'width_cm',
            'izmeri_mm_garums': 'length_cm',
            'izmeri_mm_platums': 'width_cm',
            'izmeri_mm_augstums': 'height_cm',
            'izmeri_platums_mm': 'width_cm',
            'izmeri_garums_mm': 'length_cm',
            'izmeri_augstums_mm': 'height_cm',
            'iekartas_izmeri_mm_platums': 'width_cm',
            'iekartas_izmeri_mm_garums': 'length_cm',
            'iekartas_izmeri_mm_augstums': 'height_cm',
            'augstums_cm': 'height_cm',
            'garums_cm': 'length_cm',
            'platums_cm': 'width_cm',
            'diametrs_mm': 'diameter_cm',
            'platums_mm': 'width_cm',
            'garums_mm': 'length_cm',
            'augstums_mm': 'height_cm',
            'zavesanas_paplasu_izmeri_mm_platums': 'width_cm',
            'zavesanas_paplasu_izmeri_mm_garums': 'length_cm',
            'izmeri_m_diametrs': 'diameter',
            'izmeri_mm_diametrs': 'diameter_cm',
            'ietilpiba_m3': 'capacity_m3',
            'tilpums_m3': 'capacity_m3',
            'piekabes_ietilpiba_m3': 'capacity_m3',
            'tvetrnes_tilpums_m3': 'capacity_m3',
            'bunkura_tilpums_m3': 'capacity_m3',
            'kurinama_tvertnes_tilpums_m3': 'capacity_m3',
            'piemerots_glabatuves_ietilpibai_t': 'capacity_t',
            'ietilpiba_t': 'capacity_t',
            'kravnesiba_t': 'capacity_t',
            'kravnesiba_kg': 'capacity_t',
            'tvertnes_ietilpiba_kg': 'capacity_t',
            'tvertnes_tilpums_l': 'capacity_l',
            'graudu_tvertnes_tilpums_l': 'capacity_l',
            'tilpums_l': 'capacity_l',
            'uzkares_celtspeja_kg': 'lift_kg',
            'celtspeja_kg': 'lift_kg',
            'maksimala_celtspeja_kg': 'lift_kg',
            'manipulatora_celtspeja_kg': 'lift_kg',
            'pilna_masa_kg': 'weight',
            'svars_kg': 'weight',
            'sastava_pilna_masa_t': 'weight',
            'dzinejs_cilindru_skaits': 'engine_cylinder_count',
            'darba_platums_m': 'work_width',
            'pacelaja_darba_platums_m': 'work_width',
            'darba_platums_cm': 'work_width',
            'izkliedesana_darba_platums_m': 'work_width',
            'plausanas_platums_cm': 'work_width',
            'hedera_platums_m': 'work_width',
            'izkliedes_platums_m': 'work_width',
            'darba_razigums_t_h': 'work_capacity_t_h',
            'darba_razigums_kviesiem_t_h': 'work_capacity_t_h',
            'transportiera_razigums_t_h': 'work_capacity_t_h',
            'raziba_t_h': 'work_capacity_t_h',
            'maksimalais_darba_razigums_t_h': 'work_capacity_t_h',
            'vilceja_piena_tvertne_sukna_razigums_t_h': 'work_capacity_t_h',
            'iekartas_raziba_l_h': 'work_capacity_l_h',
            'sukna_jauda_l_h': 'work_capacity_l_h',
            'suksanas_jauda_l_min': 'work_capacity_l_h',
            'dzesesaanas_razigums_l_h': 'work_capacity_l_h',
            'sprauslas_raziba_l_h': 'work_capacity_l_h',
            'hidrosukna_razigums_l_min': 'pump_flow_l_min',
            'nepieciesamais_hidrosistemas_razigums_l_min': 'required_pump_flow_l_min',
            'nepieciesamie_hidrosistemas_parametri_razigums_l_min': 'required_pump_flow_l_min',
            'maksimalais_apudenosanas_razigums_l_h': 'work_capacity_l_h',
            'parametri_raziba_m3_min': 'work_capacity_m3_h',
            'maksimala_gaisa_plusma_m3_min': 'work_capacity_m3_h',
            'raziba_m3_h': 'work_capacity_m3_h', 
            'suknis_razigums_m3_h': 'work_capacity_m3_h', 
            'ventilators_gaisa_plusma_m3_h': 'work_capacity_m3_h', 
            'maksimalais_darba_razigums_m3_h': 'work_capacity_m3_h', 
            'darba_razigums_m3_h': 'work_capacity_m3_h', 
            'max_gaisa_plusma_m3_h': 'work_capacity_m3_h',
        }
        self.convert_models = {
            'ls_mtron': {
                'xu_6168': 'XU6168',
                'xu_6158': 'XU6158'
            },
            'ls_tractor': {
                'plus_100_p_s': 'PS100'
            }
        }
        self.convert_marks = {
            'ls_tractor': 'LS',
            'ls_mtron': 'LS'
        }
        self.convert_equipment_level = {
            'bazes': 'base',
            'videjais': 'medium',
            'premium': 'premium'
        }
        
    def build(self):
        catalog = []
        for item in self.data:
            catalog_item = {}
            category = clean_key(item['category'])
            sub_category = clean_key(item['technical_unit'])
            mark_key = clean_key(item['mark'])
            model_key = clean_key(item['model'])
            mark = item['mark']
            model = item['model']
            price = item['price']
            sources = [item['source']]
            metadata = item['metadata']
            metadata['eps_lad_number'] = item['eps_lad_number']
            specification = {}
            equipment_level = self.convert_equipment_level[clean_key(item['equipment_level'])]
            if category in self.convert_categories.keys():
                category = self.convert_categories[category]
            if sub_category in self.convert_sub_categories.keys():
                sub_category = self.convert_sub_categories[sub_category]

            if mark_key in self.convert_models.keys():
                if model_key in self.convert_models[mark_key].keys():
                    model = self.convert_models[mark_key][model_key]
            
            if mark_key in self.convert_marks.keys():
                mark_key = clean_key(self.convert_marks[mark_key])
            
            for value_key in self.convert_specification_key.keys():
                if value_key in metadata:
                    if value_key in self.specification_values:
                        specification[self.convert_specification_key[value_key]] = self.specification_values[value_key](metadata[value_key])
                    else:
                        specification[self.convert_specification_key[value_key]] = metadata[value_key]
                    
                    del metadata[value_key]
                
            catalog_item['category'] = category
            catalog_item['sub_category'] = sub_category
            catalog_item['mark'] = self.marks[mark_key]
            catalog_item['model'] = model
            catalog_item['equipment_level'] = equipment_level
            catalog_item['price'] = price
            catalog_item['sources'] = sources
            catalog_item['specification'] = specification
            catalog_item['unsorted_metadata'] = metadata
            catalog.append(catalog_item)
        return catalog

class TractorDataCatalog:
    def __init__(self, json_file):
        self.data = open_json(json_file)
        self.specification_values = {
            'engine': lambda v: v['value'],
            'engine_gross': lambda v: v['value'],
            'engine_net': lambda v: v['value'],
            'pump_flow': lambda v: v['value'],
            'total_flow': lambda v: v['value'],
            'weight': lambda v: v['value'] if type(v) is dict and 'value' in v else avg(re.findall('[0-9]+', v)) * 0.45359237, # https://www.calculatorsoup.com/calculators/conversions/pounds-to-kilograms.php lb -> kg 
            'rear_lift_at_24_610mm': lambda v: v['value'],
            'rear_lift_at_ends': lambda v: v['value'],
            'rear_lift': lambda v: v['value'],
            'front_lift': lambda v: v['value'],
            'pto_tested': lambda v: v['value'],
            'pto_claimed': lambda v: v['value'],
            'drawbar_tested': lambda v: v['value'],
            'drawbar_claimed': lambda v: v['value'],
            'fuel_tank': lambda v: v['value'],
            'fuel': lambda v: v['value'],
            'chassis': lambda v: 'tractor_4x4' if v.lower().startswith('4x4') else 'tractor_4x4' if v.lower().startswith('crawler') else 'tractor_4x2'
        }
        self.convert_specification_key = {
            'engine_gross': 'power',
            'engine_net': 'power',
            'engine': 'power',
            'pump_flow': 'pump_flow_l_min',
            'total_flow': 'pump_flow_l_min',
            'weight': 'weight',
            'rear_lift_at_24_610mm': 'lift_kg',
            'rear_lift_at_ends': 'lift_kg',
            'rear_lift': 'lift_kg',
            'front_lift': 'front_lift_kg',
            'pto_tested': 'power_take_off',
            'pto_claimed': 'power_take_off',
            'drawbar_tested': 'drawbar',
            'drawbar_claimed': 'drawbar',
            'fuel_tank': 'fuel_tank_l',
            'fuel': 'fuel_tank_l',
        }
    def build(self):
        catalog = []
        for mark, mark_data in self.data.items():
            mark_key = clean_key(mark_data['mark'])
            mark = mark_data['mark']
            for model, model_data in mark_data['models'].items():
                catalog_item = {}
                specification = {}
                model_key = clean_key(model_data['model'])
                model = model_data['model']
                metadata = model_data['metadata']
                sources = [model_data['url']]
                price = -1
                if 'original_price' in model_data['metadata']:
                    price = clean_currency(model_data['metadata']['original_price'])
                    del model_data['metadata']['original_price']

                for value_key in self.convert_specification_key.keys():
                    if value_key in metadata:
                        if value_key in self.specification_values:
                            specification[self.convert_specification_key[value_key]] = self.specification_values[value_key](metadata[value_key])
                        else:
                            specification[self.convert_specification_key[value_key]] = metadata[value_key]
                        
                        del metadata[value_key]

                catalog_item['category'] = 'tractors'
                catalog_item['sub_category'] = 'agriculture_tractor'
                catalog_item['mark'] = mark
                catalog_item['model'] = model
                catalog_item['equipment_level'] = 'base'
                catalog_item['price'] = price
                catalog_item['sources'] = sources
                catalog_item['specification'] = specification
                catalog_item['unsorted_metadata'] = metadata
                catalog.append(catalog_item)
        return catalog
    
class MacusCatalog:
    def __init__(self, json_file):
        self.data = open_json(json_file)

    def build(self):
        catalog = []

        return catalog