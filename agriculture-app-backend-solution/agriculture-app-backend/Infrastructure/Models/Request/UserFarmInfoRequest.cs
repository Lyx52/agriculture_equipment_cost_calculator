namespace AgricultureAppBackend.Infrastructure.Models.Request;

public class UserFarmInfoRequest
{
    public string FarmName { get; set; }
    public double DefaultWage { get; set; }
    public double OtherExpensesPercentage { get; set; }
    public double LubricationCostsPercentage { get; set; }
    public double FuelCostPerLiter { get; set; }
}