from utils import open_json
import json
def build_equipment_data():
    technical_equipment = open_json('combined_data.json')
    with open("sql/technical_equipment.sql", "w", encoding="utf-8") as fp:
        fp.write("TRUNCATE uzc_gazes.technical_equipment;\n")
        for item in technical_equipment:
            fp.write(f"INSERT INTO uzc_gazes.technical_equipment(mark, model, category_code, sub_category_code, equipment_level_code, price, specification, sources) VALUES ('{item['manufacturer']}', '{item['model']}', '{item['category']}', '{item['sub_category']}', '{item['equipment_level_code']}', {item['price']}, '{json.dumps(item['specification'])}', '{json.dumps(item['sources'])}');\n")
        fp.close()

def build_macus_data():
    macus_data = open_json('average_macus.json')
    with open('sql/macus_equipment_prices.sql', 'w', encoding='utf-8') as fp:
        fp.write("TRUNCATE uzc_gazes.macus_equipment_prices;\n")
        for group in macus_data.keys():
            for year in macus_data[group].keys():
                item = macus_data[group][year]
                fp.write(f"INSERT INTO uzc_gazes.macus_equipment_prices(power_group, year, listing_count, motor_hours_mean, price_mean, category_code) VALUES ('{group}', {year}, {item['listing_count']}, {item['motor_hours_mean']}, {item['price_mean']}, '{item['category']}');\n")
        fp.close()

build_macus_data()
build_equipment_data()