import json
class EquipmentModel:
    def __init__(self, manufacturer, model, price, specifications):
        self.model = model
        self.manufacturer = manufacturer
        self.price = price
        self.specifications = specifications

    def to_dict(self):
        return {
            "Model": self.model,
            "Manufacturer": self.manufacturer,
            "Price": self.price,
            "Specifications": json.dumps(self.specifications)
        }