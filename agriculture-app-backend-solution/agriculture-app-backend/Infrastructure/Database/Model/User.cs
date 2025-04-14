using Microsoft.AspNetCore.Identity;

namespace AgricultureAppBackend.Infrastructure.Database.Model;

public class User : IdentityUser
{
    public string FarmName { get; set; }
    public double DefaultWage { get; set; } = 15.0f;
    public double OtherExpensesPercentage { get; set; } = 1.0f;
    public double LubricationCostsPercentage { get; set; } = 15.0f;
    public double FuelCostPerLiter { get; set; } = 0.8f;
    public List<UserEquipment> Equipment { get; set; } = new List<UserEquipment>();
    public List<UserFarmland> Farmlands { get; set; } = new List<UserFarmland>();
    public List<UserCropType> CropTypes { get; set; } = new List<UserCropType>();
    public List<UserAdjustment> Adjustments { get; set; } = new List<UserAdjustment>();
}