from utils import open_csv, save_json, normalize_text

data = open_csv('../static/repair_costs.csv')
result = {}
hours = list(map(lambda v: v.strip(), data[0][1:]))
for line in data[1:]:
    category = normalize_text(line[0]).replace(' ', '_')
    percentages = list(map(lambda v: round(float(v.strip().replace('%', '')) / 100, 4), filter(lambda v: v.strip() != '', line[1:])))
    if category not in result:
        result[category] = {}
    for value, hour in zip(percentages, hours[0:len(percentages)]):
        result[category][hour] = value

save_json("../data/repair_values/values.json", result)
