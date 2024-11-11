import os, json
from utils import clean_key, convert_to_eur
json_files = list(filter(lambda f: str(f).endswith('.json'), os.listdir('./mascus')))
fp = open('mascus.csv', 'w', encoding='UTF-8')
header = [
    'Cena (USD->EUR kurss uz 2024-10-10)', 'Saite', 'Kategorija', 'Marka un modelis', 'Gads', 'Valsts', 'Motorstundas (h)', 'Jauda (zs)', 'Piedziņa/Vilce'
]
fp.write(';'.join(header) + '\n')
for file in json_files:
    data = json.load(open(f"./mascus/{file}"))
    for listing in data:
        if listing['price'] <= 0:
            continue
        cols = [
            round(convert_to_eur(listing['price'], 'USD', '2024-10-10'), 2),
            listing['url'],
            clean_key(listing['metadata']['unsorted_metadata']['category']) if 'category' in listing['metadata']['unsorted_metadata'] else '',
            listing['metadata']['model'] if 'model' in listing['metadata'] else listing['metadata']['unsorted_metadata']['brand_model'] if 'brand_model' in listing['metadata']['unsorted_metadata'] else '',
            listing['metadata']['unsorted_metadata']['country'] if 'country' in listing['metadata']['unsorted_metadata'] else '',
            listing['metadata']['unsorted_metadata']['year'] if 'year' in listing['metadata']['unsorted_metadata'] else '',
            listing['motor_hours'] if 'motor_hours' in listing else '',
            listing['metadata']['engine_power'] if 'engine_power' in listing['metadata'] else '',
            listing['metadata']['unsorted_metadata']['traction'] if 'traction' in listing['metadata']['unsorted_metadata'] else '',
        ]
        fp.write(';'.join([str(v) for v in cols]) + '\n')

fp.close()


