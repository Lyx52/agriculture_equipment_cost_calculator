from utils import open_json, clean_key, clean_value, save_json, convert_zs_to_kw
from equipment_model import EquipmentModel
from bs4 import BeautifulSoup
lectura_specs_data = open_json("lectura_data.json")
sub_category_to_category = {
    'tractor_4x2': 'tractor',
    'tractor_4x4': 'tractor',
    'plough': 'soil_cultivation_equipment',
    'cultivator': 'soil_cultivation_equipment',
    'packing_press': 'feed_preperation_equipment',
    'balling_press': 'feed_preperation_equipment',
    'seed_drill': 'sowing_and_planting_equipment'
}

models = []
unknown_parameters = {}
for url, item in lectura_specs_data.items():
    sub_category = item['sub_category']
    if sub_category not in sub_category_to_category.keys():
        raise Exception(f"{sub_category} not in sub_category_to_category")
    category = sub_category_to_category[sub_category]
    
    soup = BeautifulSoup(item['table'], features="html.parser")
    specifications = {}
    for term in soup.find_all("dl"):
        name = term.find("dt").text.strip()
        value = term.find("dd").text.strip()
        match name:
            case 'Engine power':
                specifications['engine_power_kw'] = float(value.replace('\xa0kW', ''))
            case 'Weight':
                if 'kg' in value:
                    value = value.replace('\xa0kg', '')
                    if '/' in value:
                        value = value.split('/')[1]
                    specifications['weight'] = float(value)
                    continue
                value = value.replace('\xa0t', '')
                if '/' in value:
                    value = value.split('/')[1]
                specifications['weight'] = float(value) * 1000
            case 'Travel speed':
                specifications['max_speed'] = float(value.replace('\xa0km/h', ''))
            case 'Engine':
                specifications['engine_power_kw'] = convert_zs_to_kw(float(value.replace('hp', '')))
            case 'Engine (net)':
                specifications['engine_power_kw'] = convert_zs_to_kw(float(value.replace('hp', '')))
            case 'Engine (gross)':
                specifications['engine_power_kw'] = convert_zs_to_kw(float(value.replace('hp', '')))
            case 'PTO (claimed':
                specifications['pto_power_kw'] = convert_zs_to_kw(float(value.replace('hp', '')))
            case 'PTO (claimed)':
                specifications['pto_power_kw'] = convert_zs_to_kw(float(value.replace('hp', '')))
            case 'PTO (tested':
                specifications['pto_power_kw'] = convert_zs_to_kw(float(value.replace('hp', '')))
            case 'Drawbar (tested':
                specifications['drawbar_power_kw'] = convert_zs_to_kw(float(value.replace('hp', '')))
            case 'No. of cylinders':
                specifications['engine_cylinders'] = float(value)
            case 'Model series':
                specifications['model_series'] = value.strip()
            case 'Displacement':
                specifications['engine_displacement'] = float(value.replace('\xa0l', ''))
            case 'Transport length':
                value = value.replace('\xa0m', '')
                value = value.replace(',', '.')

                specifications['length'] = float(value)
            case 'Transport width':
                value = value.replace('\xa0m', '')
                value = value.replace(',', '.')

                if '/' in value:
                    value = value.split('/')[1]
                if '-' in value:
                    value = value.split('-')[1]
                specifications['wheelbase'] = float(value)
            case 'Max. torque':
                value = value.replace('\xa0Nm', '')
                
                if '/' in value:
                    value = value.split('/')[1]
                if '-' in value:
                    value = value.split('-')[1]
                specifications['engine_torque'] = float(value)
            case 'Required power':
                specifications['required_power_kw'] = float(value.replace('\xa0kW', ''))
            case 'Demand for power take-off. min.':
                specifications['required_power_kw'] = float(value.replace('\xa0kW', ''))
            case 'Working width':
                specifications['working_width'] = float(value.replace('\xa0m', ''))
            case 'max. working width':
                specifications['working_width'] = float(value.replace('\xa0m', ''))
            case 'No. of tines':
                specifications['number_of_tines'] = float(value)
            case 'No. of discs':
                specifications['number_of_discs'] = float(value)
            case 'No. of furrows':
                specifications['number_of_furrows'] = float(value)
            case 'Bale width from-to':
                value = value.replace('\xa0m', '')
                value = value.replace(',', '.')
                if '-' in value:
                    value = value.split('-')[1]
                specifications['bale_width'] = float(value)
            case 'Bale height':
                value = value.replace('\xa0m', '')
                value = value.replace(',', '.')
                if '-' in value:
                    value = value.split('-')[1]
                specifications['bale_height'] = float(value)
            case 'Bale-Ø  from-to':
                value = value.replace('\xa0m', '')
                value = value.replace(',', '.')
                if '-' in value:
                    value = value.split('-')[1]
                specifications['bale_diameter'] = float(value)
            case 'Tank capacity':
                value = value.replace('\xa0l', '')
                specifications['work_capacity_l'] = float(value)
            case 'No. of Plowshares':
                specifications['number_of_plowshares'] = float(value)
            case _:            
                if name not in unknown_parameters:
                    unknown_parameters[name] = value    
                print(f"Unknown category {name} -> {value}")
    
    if 'first_year' in item['item']:
        specifications['first_year'] = item['item']['first_year']
    if 'last_year' in item['item']:
        specifications['last_year'] = item['item']['last_year']
    print(specifications)
    model = EquipmentModel(item['item']['manufacturer_name'], item['item']['name'], category, sub_category, 'base', -1, specifications, [f"https://www.lectura-specs.com{url}"])
    models.append(model)
print(unknown_parameters)
save_json("lectura_specs_catalog_data.json", [item.toDict() for item in models])