from utils import normalize_text, save_json, open_json, convert_zs_to_kw
import os, re
import numpy as np
import pandas as pd

path_to_mascus_data = "../data/mascus"
mascus_data = open_json(f"{path_to_mascus_data}/mascus.json")

def build_from_listing(listing):
    return {
        "mark": listing["brand"],
        "model": listing["model"],
        "price": listing["priceEURO"],
        "mascusCategory": listing["categoryName"].replace('-', '_'),
        "manufactureYear": listing["yearOfManufacture"],
        "motorHours": listing["meterReadout"] if listing["meterReadoutUnit"] == "h" else None,
        "drivenDistance": listing["meterReadout"] if listing["meterReadoutUnit"] == "km" else None,
        "id": listing["productId"]
    }

def build_average_prices_hours(data):
    hours_results = {}
    prices_results = {}
    for listing in data:
        category = listing["mascusCategory"]
        year = listing["manufactureYear"]
        price = listing["price"]
        hours = listing["motorHours"]

        if year is None:
            continue

        if category not in hours_results:
            hours_results[category] = {}
        if year not in hours_results[category]:
            hours_results[category][year] = []
        if hours is not None:
            hours_results[category][year].append(hours)

        if category not in prices_results:
            prices_results[category] = {}
        if year not in prices_results[category]:
            prices_results[category][year] = []
        if price is not None:
            prices_results[category][year].append(price)

    def build_averages(items):
        averages = {}
        for category, years in items:
            if category not in averages:
                averages[category] = {}
            for year, values in years.items():
                if len(values) > 0:
                    averages[category][year] = np.average(np.array(values)).item()
        for category, year_data in averages.items():
            if len(year_data.keys()) <= 0:
                continue
            df = pd.DataFrame(list(year_data.items()), columns=["Year", "Value"]).sort_values("Year")
            min_year, max_year = int(df["Year"].min()), int(df["Year"].max())
            df = df.set_index("Year").reindex(range(min_year, max_year + 1))
            
            df["Value"] = df["Value"].interpolate(method="linear")
            
            df["Value"] = df["Value"].round(-2)
            
            averages[category] = df["Value"].dropna().to_dict()
        return averages
    
    return build_averages(hours_results.items()), build_averages(prices_results.items())

results = {}
for listing in mascus_data.values():
    data = build_from_listing(listing)
    if data["id"] not in results:
        results[data["id"]] = data
results = list(results.values())
motor_hours, prices = build_average_prices_hours(results)

save_json(f"{path_to_mascus_data}/mascus_hours.json", motor_hours)  
save_json(f"{path_to_mascus_data}/mascus_prices.json", prices)    
