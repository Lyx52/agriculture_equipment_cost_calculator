import subprocess
execute_order = [
    "task_build_remaining_values",
    "task_build_repair_values",
    "task_scrape_lad_catalog",
    "task_build_codifiers",
    "task_build_from_scraped_data",
    "task_build_equipment_catalog",
    "task_build_mascus_category_map",
    "task_scrape_mascus"
]
if __name__ == "__main__":
    for script in execute_order:
        print(f"Executing {script}.py...")
        subprocess.run(["python", f"./{script}.py"], cwd="./tasks")