from utils import save_json, open_csv


# remaining_value_combine
data = open_csv('../static/remaining_value_combine.csv')
result = {}
header = data[0][1:]
for line in data[1:]:
    percentages = list(map(lambda v: float(v.strip().replace('%', '')) / 100, line[1:]))
    for hour, percentage in zip(header, percentages):
        if hour.strip() not in result:
            result[hour.strip()] = []
        result[hour.strip()].append(percentage)

save_json("../data/remaining_values/combine.json", result)

# remaining_value_tractor
data = open_csv('../static/remaining_value_tractor.csv')
result = {}
hps = data[0][1:]
hours = data[1][1:]

for line in data[2:]:
    percentages = list(map(lambda v: float(v.strip().replace('%', '')) / 100, line[1:]))
    for hour, hp, percentage in zip(hours, hps, percentages):
        if hour not in result:
            result[hour] = {}
        if hp not in result[hour]:
            result[hour][hp] = []
        result[hour][hp].append(percentage)

save_json("../data/remaining_values/tractor.json", result)


# remaining_value_machines

data = open_csv('../static/remaining_value_machines.csv')
result = {}
header = data[0][1:]
for line in data[1:]:
    percentages = list(map(lambda v: float(v.strip().replace('%', '')) / 100, line[1:]))
    for category, percentage in zip(header, percentages):
        if category.strip() not in result:
            result[category.strip()] = []
        result[category.strip()].append(percentage)

save_json("../data/remaining_values/machine.json", result)