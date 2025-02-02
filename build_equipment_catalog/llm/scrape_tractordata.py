from scrapegraphai.graphs import SmartScraperGraph
from pydantic import BaseModel, Field

class ModelData(BaseModel):
    model: str
    mark: str
    PowerTrainCode: str = Field(
        name="PowerTrainCode",
        type="enum",
        enum_values=["tractor_4x4", "tractor_4x2", "tractor_track"],
        description="Type of tractor powertrain"
    ),
    PowerTrainCode: float = Field(
        name="Power",
        type="number",
        unit="kw",
        description="Engine power in kilowatts"
    ),
    PowerTrainCode: float = Field(
        name="Weight",
        type="number",
        unit="kg",
        description="Tractor weight in kilograms"
    ),
    PowerTrainCode: float = Field(
        name="FuelUsage",
        type="number",
        unit="l/h",
        description="Fuel consumption in liters per hour"
    ),
    PowerTrainCode: float = Field(
        name="LiftingCapacity",
        type="number",
        unit="kg",
        description="Lifting capacity in kilograms"
    ),
    PowerTrainCode: float = Field(
        name="Torque",
        type="number",
        description="Engine torque"
    ),
    PowerTrainCode: float = Field(
        name="Price",
        type="number",
        currency="EUR",
        description="Price adjusted to today's value and converted to Euros if necessary"
    )
class Models(BaseModel):
    services: list[ModelData]
# Define the configuration for the scraping pipeline
graph_config = {
    "llm": {
        "api_key": "", 
        "model": "openai/gpt-4o-mini",
        "temperature": 0,
    },
    "verbose":True,
}

# Create the SmartScraperGraph instance
smart_scraper_graph = SmartScraperGraph(
    prompt="Extract useful information from the webpage, including a description of what the company does, founders and social media links",
    source="https://tractordata.com/farm-tractors/",
    config=graph_config,
    schema=Models
)

# Run the pipeline
result = smart_scraper_graph.run()

import json
print(json.dumps(result, indent=4))