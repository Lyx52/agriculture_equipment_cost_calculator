namespace AgricultureAppBackend.Infrastructure.Models.Json;

public class EquipmentUsage
{
    public double ExpectedAge { get; set; } = 15;
    public double HoursPerYear { get; set; } = 300;
    public Dictionary<string, double> HoursPerIndividualYears { get; set; } = new Dictionary<string, double>();
    public bool UseHoursPerIndividualYears { get; set; } = false;
}