using System.ComponentModel.DataAnnotations;

namespace AgricultureAppBackend.Infrastructure.Database.Model;

public class UserFarmland
{
    [Key]
    public string Id { get; set; }
   
    public double Area { get; set; }
    
    public string? ProductCropTypeId { get; set; }
    public UserCropType? ProductCropType { get; set; }
    
    public List<FarmlandOperation> Operations { get; set; } = new List<FarmlandOperation>();
    
    public string UserId { get; set; }
    public User User { get; set; }
    public DateTime Created { get; set; }
}