using AgricultureAppBackend.Infrastructure.Database.Model;

namespace AgricultureAppBackend.Infrastructure.Models.Response;

public class UserFarmInfoResponse
{
    public string FarmName { get; set; }
    public double DefaultWage { get; set; }
    public double OtherExpensesPercentage { get; set; }
    public double LubricationCostsPercentage { get; set; }
    public double FuelCostPerLiter { get; set; }
    public int[] FarmlandYears { get; set; } = [];

    public static UserFarmInfoResponse FromUser(User user, int[] farmlandYears)
    {
        return new UserFarmInfoResponse()
        {
            DefaultWage = user.DefaultWage,
            FarmName = user.FarmName,
            LubricationCostsPercentage = user.LubricationCostsPercentage,
            OtherExpensesPercentage = user.OtherExpensesPercentage,
            FuelCostPerLiter = user.FuelCostPerLiter,
            FarmlandYears = farmlandYears
        };
    }
}