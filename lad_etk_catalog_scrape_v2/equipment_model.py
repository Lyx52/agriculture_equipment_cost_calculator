from enum import Enum
import json
class EquipmentModelMetadata(Enum):
    Weight = "weight",
    Wheelbase = "wheelbase",
    Length = 'length',
    PtoPowerKw = "pto_power_kw",
    EnginePowerKw = "engine_power_kw",
    EngineCylinders = "engine_cylinders",
    EngineDisplacement = "engine_displacement",
    EngineTorque = "engine_torque",
    FuelCapacity = 'fuel_capacity',
    HydraulicPumpFlowCapacity = 'hydrolic_pump_flow',
    MaxSpeed = 'max_speed',
    LiftCapacity = 'lift_capacity',
    Powertrain = 'powertrain',
    RequiredPowerKw = 'required_power_kw',
    WorkingWidth = 'working_width',
    WorkingWidthMin = 'working_width_min',
    BaseEquipmentWidth = 'base_equipment_width',
    BaleWidth = 'bale_width',
    BaleDiameter = 'bale_diameter',
    DiscDiameter = 'disc_diameter',
    WorkCapacityL = 'work_capacity_l',
    WorkCapacityKg = 'work_capacity_kg',
    MaxFieldSpeed = 'max_field_speed'

class EquipmentLevelCode(Enum):
    Base = "base"
    Medium = "medium"
    Premium = "premium"

class EquipmentCategory(Enum):
    Tractor = "tractor",
    Combine = "combine",
    Plough = "plough",
    Harrow = "harrow",
    Planter = "planter",
    Seeder = "seeder",
    Mower = "mower",
    Disc = "disc",
    Chipper = "chipper",
    Cultivator = "cultivator",
    BalerPress = "baler_press",
    Rake = "rake",
    Sprayer = "sprayer",
    Other = "other"

class EquipmentModel:
    specification: dict
    category: str
    equipment_level_code: EquipmentLevelCode
    price: float
    sources: list[str]
    manufacturer: str
    model: str
    def __init__(self, manufacturer: str, model: str, category: str, equipment_level_code: EquipmentLevelCode, price: float, specification: dict, sources: list[str]):
        self.specification = specification
        self.category = category
        self.equipment_level_code = equipment_level_code
        self.price = price
        self.sources = sources
        self.manufacturer = manufacturer
        self.model = model
    
    def toDict(self) -> dict:
        return {
            "category": str(self.category.value[0]),
            "manufacturer": str(self.manufacturer),
            "model": str(self.model),
            "sources": self.sources,
            "price": self.price,
            "equipment_level_code":  str(self.equipment_level_code.value),
            "specification": self.specification
        }