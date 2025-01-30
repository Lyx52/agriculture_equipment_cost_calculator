from utils import normalize_text, save_json, open_json, convert_zs_to_kw
import os, re


path_to_mascus_data = "../data/mascus"
mascus_data = open_json(f"{path_to_mascus_data}/mascus.json")
mascus_categories = open_json(f"{path_to_mascus_data}/mascus_category_map.json")

def build_from_listing(listing):
    return {
        "mark": listing["brand"],
        "model": listing["model"],
        "price": listing["priceEURO"],
        "mascusCategory": mascus_categories[listing["categoryName"]].replace('-', '_'),
        "manufactureYear": listing["yearOfManufacture"],
        "motorHours": listing["meterReadout"] if listing["meterReadoutUnit"] == "h" else None,
        "drivenDistance": listing["meterReadout"] if listing["meterReadoutUnit"] == "km" else None,
    }
results = []
for listing in mascus_data['listings']:
    results.append(build_from_listing(listing))

print(len(results))
save_json(f"{path_to_mascus_data}/mascus_short.json", results)