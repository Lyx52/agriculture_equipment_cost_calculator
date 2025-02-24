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
    },
    {
        "Code": "custom_adjustments",
        "ParentCode": None,
        "Name": "Papildus pielāgotās izmaksas" 
    },
    {
        "Code": "custom_adjustments_materials",
        "ParentCode": "custom_adjustments",
        "Name": "Papildus pielāgotās izmaksas" 
    },
    {
        "Code": "custom_adjustments_operations",
        "ParentCode": "custom_adjustments",
        "Name": "Papildus pielāgotās izmaksas" 
    },
    {
        "Code": "employee_wage_eur_h",
        "ParentCode": "custom_adjustments_materials",
        "Name": "Darbinieka alga EUR/h" 
    },
    {
        "Code": "custom_material_cost_eur_ha",
        "ParentCode": "custom_adjustments_operations",
        "Name": "Papildus izejvielu izmaksas EUR/ha" 
    },

]

# LAD Categories
categories = open("../static/lad_categories.csv", "r", encoding="UTF-8")
lines = categories.readlines()
categories.close()
added = []
values = []
all_categories = []
for line in lines:
    [parent, child, remaining_value_code, average_speed, field_efficiency, mascus_category_code] = line.split(';')
    
    if parent not in added:
        codifiers.append({
            "Code": normalize_text(parent).replace(' ', '_'),
            "ParentCode": "equipment_type_categories",
            "Name": parent.strip()
        })
        added.append(parent)
    if child not in added:
        all_categories.append(normalize_text(child).replace(' ', '_'))
        codifiers.append({
            "Code": normalize_text(child).replace(' ', '_'),
            "ParentCode": normalize_text(parent).replace(' ', '_'),
            "Name": child.strip(),
            "Value": json.dumps({
                'remaining_value_code': remaining_value_code.strip(),
                'average_speed': None if len(average_speed.strip()) <= 0 else float(average_speed.strip()),
                'field_efficiency': None if len(field_efficiency.strip()) <= 0 else float(field_efficiency.strip()) ,
                'mascus_category_code': mascus_category_code.strip()
            })
        })
        added.append(child)

# LAD Crops
categories = open("../static/lad_crops.csv", "r", encoding="UTF-8")
lines = categories.readlines()
categories.close()
added = []
values = []
for line in lines:
    print(line)
    [code, name, standard_yield_t_ha, product_price_eur_t, seed_cost_eur_kg, seeds_per_ha] = line.split(';')
    
    if code not in added:
        codifiers.append({
            "Code": f"crop_{code}",
            "ParentCode": "crop_type_categories",
            "Name": name.strip(),
            "Value": json.dumps({
                'standard_yield': float(standard_yield_t_ha),
                'standard_product_price': float(product_price_eur_t),
                'standard_seed_cost': float(seed_cost_eur_kg),
                'standard_field_usage': float(seeds_per_ha),
                'code': str(code)
            })
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
print(all_categories)