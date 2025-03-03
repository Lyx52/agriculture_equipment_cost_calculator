using System.ComponentModel.DataAnnotations;

namespace AgricultureAppBackend.Infrastructure.Database.Model;

public class UserAdjustment
{
    [Key]
    public string Id { get; set; }
    public string Name { get; set; }
    public double Value { get; set; }
    public string AdjustmentTypeCode { get; set; }
    public Codifier AdjustmentType { get; set; }
    
    public string UserId { get; set; }
    public User User { get; set; }
    public DateTime Created { get; set; }

    public List<FarmlandOperation> Operations { get; set; } = new List<FarmlandOperation>();
}