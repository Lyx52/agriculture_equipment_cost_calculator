namespace AgricultureAppBackend.Infrastructure.Models.Json;

public class EquipmentSpecification
{
    public float? Power { get; set; }
    public float? RequiredPower { get; set; }
    public string? PowerTrainCode { get; set; }
    public float? WorkWidth { get; set; }
    public bool? SelfPropelled { get; set; }
    public string? CultivatorType { get; set; }
    public string? ShredderType { get; set; }
    public string? RepairValueCode { get; set; }
    public float? FuelConsumptionCoefficient { get; set; }
}