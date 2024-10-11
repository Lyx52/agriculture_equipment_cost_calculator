from utils import open_json, clean_key, save_json, avg, clean_currency
import json
def build_categories_script(fp, categories: dict, parent_code: str, parent_name: str):
    fp.write(f"DELETE FROM uzc_gazes.codifier WHERE parent_id IN (SELECT id FROM uzc_gazes.codifier WHERE code = '{parent_code}');\n")
    fp.write(f"CALL uzc_gazes.create_codifier('{parent_code}', '{parent_name}');\n")
    for key, name in categories.items():
        fp.write(f"CALL uzc_gazes.create_codifier('{key}', '{name}', '{parent_code}');\n")

def build_tractor_script():
    tractors = open_json('tractors_refined.json')
    with open("tractors.sql", "w", encoding="utf-8") as fp:
        fp.write("DELETE FROM uzc_gazes.technical_equipment WHERE category_code IN ('categories');\n")
        for mark, mark_data in tractors.items():
            for model, model_data in tractors[mark]['models'].items():
                types = model_data['types']
                fp.write(f"INSERT INTO uzc_gazes.technical_equipment(mark, model, category_code) VALUES ('{mark_data['mark']}', '{model_data['model']}', 'tractors');\n")
                for type_key, type_data in types.items():
                    for key in ['avg_price', 'avg_weight', 'avg_power']:
                        if key in model_data and model_data[key] > 0:
                            fp.write(f"CALL uzc_gazes.create_technical_equipment_metadata('{mark_data['mark']}'::text, '{model_data['model']}'::text,'tractors'::text, '{type_key}', '{key}'::text, NULL::text, {model_data[key]});\n")
                    for metadata_key, metadata_value in type_data.items():
                        text_value = f"'{json.dumps(metadata_value)}'" if type(metadata_value) is list else f"'{metadata_value}'" if type(metadata_value) is str else 'NULL'
                        numeric_value = 'NULL' if type(metadata_value) is not float else metadata_value
                        fp.write(f"CALL uzc_gazes.create_technical_equipment_metadata('{mark_data['mark']}'::text, '{model_data['model']}'::text,'tractors'::text, '{type_key}', '{metadata_key}'::text, {text_value}, {numeric_value});\n")

codifiers = {
    'categories': {
        'name': 'Kategorijas',
        'values': {
            'tractors': 'Traktori',
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
            'avg_price': 'Vidējā cena (EUR)',
            'avg_weight': 'Vidējā masa (kg)',
            'avg_power': 'Vidējā jauda (kW)',
            'power': 'Jauda (kW)',
            'weight': 'Masa (kg)',
            'source': 'Datu avoti'
        }
    },
}

with open('codifiers.sql', 'w', encoding='utf-8') as fp:
    for codifier_key, codifier_data in codifiers.items():
        build_categories_script(fp, codifier_data['values'], codifier_key, codifier_data['name'])
build_tractor_script()