from utils import open_json, clean_key, save_json, avg, clean_currency
import json
def build_categories_data(fp, categories: dict, parent_code: str, parent_name: str):
    fp.write(f"DELETE FROM uzc_gazes.codifier WHERE parent_id IN (SELECT id FROM uzc_gazes.codifier WHERE code = '{parent_code}');\n")
    fp.write(f"CALL uzc_gazes.create_codifier('{parent_code}', '{parent_name}');\n")
    for key, value in categories.items():
        if type(value) is dict:
            fp.write(f"CALL uzc_gazes.create_codifier('{key}', '{value['name']}', '{parent_code}');\n")
            build_categories_data(fp, value['values'], key, value['name'])
            continue
        fp.write(f"CALL uzc_gazes.create_codifier('{key}', '{value}', '{parent_code}');\n")

def build_equipment_data():
    technical_equipment = open_json('technical_equipment.json')
    with open("technical_equipment.sql", "w", encoding="utf-8") as fp:
        fp.write("TRUNCATE uzc_gazes.technical_equipment;\n")
        for item in technical_equipment:
            if 'price' not in item or type(item['price']) is str:
                item['price'] = -1
            fp.write(f"INSERT INTO uzc_gazes.technical_equipment(mark, model, category_code, sub_category_code, equipment_level_code, price, specification, sources) VALUES ('{item['mark']}', '{item['model']}', '{item['category']}', '{item['sub_category']}', '{item['equipment_level']}', {item['price']}, '{json.dumps(item['specification'])}', '{json.dumps(item['sources'])}');\n")
        fp.close()

def build_macus_data():
    macus_data = open_json('average_macus.json')
    with open('macus_equipment_prices.sql', 'w', encoding='utf-8') as fp:
        fp.write("TRUNCATE uzc_gazes.macus_equipment_prices;\n")
        for group in macus_data.keys():
            for year in macus_data[group].keys():
                item = macus_data[group][year]
                fp.write(f"INSERT INTO uzc_gazes.macus_equipment_prices(power_group, year, listing_count, motor_hours_mean, price_mean, category_code) VALUES ('{group}', {year}, {item['listing_count']}, {item['motor_hours_mean']}, {item['price_mean']}, '{item['category']}');\n")
        fp.close()

codifiers = {
    'categories': {
        'name': 'Kategorijas',
        'values': {
            'tractors':  {
                'name': 'Traktori',
                'values': {
                    'agriculture_tractor': 'Tractors'   
                }
            },
            'agricultural_harvesters': {
                'name': 'Kombaini',
                'values': {
                    'potato_harvester': 'Kartupeļu novākšanas kombains',
                    'combine_harvester': 'Graudaugu kombains'
                },
            }
        }
    },
    'equipment_level': {
        'name': 'Aprīkojuma līmenis',
        'values': {
            'base': 'Bāzes',
            'medium': 'Vidējais',
            'premium': 'Premium',
        }
    },
    'value_types': {
        'name': 'Vērtību tipi',
        'values': {
            'power': 'Jauda (kW)',
            'weight': 'Masa (kg)',
        }
    },
}

with open('codifiers.sql', 'w', encoding='utf-8') as fp:
    for codifier_key, codifier_data in codifiers.items():
        build_categories_data(fp, codifier_data['values'], codifier_key, codifier_data['name'])
build_macus_data()
build_equipment_data()