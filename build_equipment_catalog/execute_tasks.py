import subprocess
# execute_order = [
#     "task_scrape_lad_catalog",
#     "task_build_equipment_categories",
#     "task_build_equipment_catalog"
# ]
subprocess.run(["python", "./task_scrape_lad_catalog.py"], cwd="./tasks")