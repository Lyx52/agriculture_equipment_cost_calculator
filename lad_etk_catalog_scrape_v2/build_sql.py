from utils import open_json, clean_key, save_json, avg, clean_currency
import json
def build_categories_data(fp, categories: dict, parent_code: str, parent_name: str):
    fp.write(f"CALL uzc_gazes.create_codifier('{parent_code}', '{parent_name}');\n")
    for key, value in categories.items():
        if type(value) is dict:
            fp.write(f"CALL uzc_gazes.create_codifier('{key}', '{value['name']}', '{parent_code}');\n")
            build_categories_data(fp, value['values'], key, value['name'])
            continue
        fp.write(f"CALL uzc_gazes.create_codifier('{key}', '{value}', '{parent_code}');\n")

def build_equipment_data():
    technical_equipment = open_json('combined_data.json')
    with open("sql/technical_equipment.sql", "w", encoding="utf-8") as fp:
        fp.write("TRUNCATE uzc_gazes.technical_equipment;\n")
        for item in technical_equipment:
            fp.write(f"INSERT INTO uzc_gazes.technical_equipment(mark, model, category_code, equipment_level_code, price, specification, sources) VALUES ('{item['manufacturer']}', '{item['model']}', '{item['category']}', '{item['equipment_level_code']}', {item['price']}, '{json.dumps(item['specification'])}', '{json.dumps(item['sources'])}');\n")
        fp.close()

def build_macus_data():
    macus_data = open_json('average_macus.json')
    with open('sql/macus_equipment_prices.sql', 'w', encoding='utf-8') as fp:
        fp.write("TRUNCATE uzc_gazes.macus_equipment_prices;\n")
        for group in macus_data.keys():
            for year in macus_data[group].keys():
                item = macus_data[group][year]
                fp.write(f"INSERT INTO uzc_gazes.macus_equipment_prices(power_group, year, listing_count, motor_hours_mean, price_mean, category_code) VALUES ('{group}', {year}, {item['listing_count']}, {item['motor_hours_mean']}, {item['price_mean']}, '{item['category']}');\n")
        fp.close()\

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
            },
            'sowing_and_planting_machines': {
                'name': 'Sējas un stādāmā tehnika',
                'values': {
                    'drills': 'Sējmašīna'
                }
            },
            'tillage_machines': {
                'name': 'Augsnes apstrādes tehnika un iekārtas',
                'values': {
                    'mills': 'Frēze',
                    'plough': 'Arkls'
                }
            },
            'hay_and_forage_machines': {
                'name': 'Lopbarības sagatavošanas tehnika',
                'values': {
                    'mowers': 'Pļaujmašīna'
                }
            },
            'fertilization_and_plant_protection_machines': {
                'name': 'Mēslošanas un augu aizsardzības tehnika',
                'values': {
                    'sprayer': 'Smidzinātājs'
                }
            },
            'cargo_transportation_machines': {
                'name': 'Kravu transportēšanas tehnika',
                'values': {
                    'trailer': 'Piekabe'
                }
            },
            'sowing_and_plant_care_machines': {
                'name': 'Sējumu un stādījumu kopšanas tehnika',
                'values': {
                    'forage_harvester': 'Mulčeris',
                    'grass_mower': 'Mauriņa pļaujmašīna'
                }
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
    fp.write("TRUNCATE uzc_gazes.codifier;\n")
    for codifier_key, codifier_data in codifiers.items():
        build_categories_data(fp, codifier_data['values'], codifier_key, codifier_data['name'])
build_macus_data()
build_equipment_data()