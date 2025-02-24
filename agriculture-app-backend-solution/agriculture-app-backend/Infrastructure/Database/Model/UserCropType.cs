using System.ComponentModel.DataAnnotations;

namespace AgricultureAppBackend.Infrastructure.Database.Model;

public class UserCropType
{
    [Key]
    public string Id { get; set; }
   
    public string Name { get; set; }
    
    public string Code { get; set; }
    
    public double StandardYield { get; set; }
    public double StandardProductPrice { get; set; }
    public double StandardSeedCost { get; set; }
    public double StandardFieldUsage { get; set; }
    public bool IsCustom { get; set; }
    public string? LadCode { get; set; }
    
    public string UserId { get; set; }
    public User User { get; set; }

    public List<UserFarmland> UserFarmlands { get; set; } = new List<UserFarmland>();
}