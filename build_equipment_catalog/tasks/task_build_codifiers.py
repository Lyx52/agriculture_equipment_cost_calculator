import json, os
from utils import normalize_text
path_to_codifiers = f"../data/codifiers"
if not os.path.exists(path_to_codifiers):
    os.makedirs(path_to_codifiers)

codifiers = [
    {
        "Code": "equipment_type_categories",
        "ParentCode": None,
        "Name": "Tehnikas vienības kategorijas"
    },
    {
        "Code": "crop_type_categories",
        "ParentCode": None,
        "Name": "Kūltūraugu veidi"
    },
    {
        "Code": "operation_type_categories",
        "ParentCode": None,
        "Name": "Apstrādes veidi"
    },
    {
        "Code": "powertrain_type",
        "ParentCode": None,
        "Name": "Piedziņas tips"
    },
    {
        "Code": "powertrain_4x4",
        "ParentCode": "powertrain_type",
        "Name": "4x4" 
    },
    {
        "Code": "powertrain_4x2",
        "ParentCode": "powertrain_type",
        "Name": "4x2" 
    },
    {
        "Code": "powertrain_track",
        "ParentCode": "powertrain_type",
        "Name": "Kāpurķēžu" 
    }
]

# LAD Categories
categories = open("../static/lad_categories.csv", "r", encoding="UTF-8")
lines = categories.readlines()
categories.close()
added = []
values = []
for line in lines:
    [parent, child] = line.split(';')
    if parent not in added:
        codifiers.append({
            "Code": normalize_text(parent).replace(' ', '_'),
            "ParentCode": "equipment_type_categories",
            "Name": parent.strip()
        })
        added.append(parent)
    if child not in added:
        codifiers.append({
            "Code": normalize_text(child).replace(' ', '_'),
            "ParentCode": normalize_text(parent).replace(' ', '_'),
            "Name": child.strip()
        })
        added.append(child)

# LAD Crops
categories = open("../static/lad_crops.csv", "r", encoding="UTF-8")
lines = categories.readlines()
categories.close()
added = []
values = []
for line in lines:
    [code, name] = line.split(';')
    if code not in added:
        codifiers.append({
            "Code": f"crop_{code}",
            "ParentCode": "crop_type_categories",
            "Name": name.strip(),
            "Value": str(code)
        })
        added.append(parent)

# LAD Operations
categories = open("../static/lad_operations.csv", "r", encoding="UTF-8")
lines = categories.readlines()
categories.close()
added = []
values = []
for line in lines:
    [code, name] = line.split(';')
    if code not in added:
        codifiers.append({
            "Code": f"operation_{code}",
            "ParentCode": "operation_type_categories",
            "Name": name.strip(),
            "Value": str(code)
        })
        added.append(parent)

with open(f'{path_to_codifiers}/codifiers.json', "w", encoding="UTF-8") as fp:
    json.dump(codifiers, fp, indent=4)
