using System.ComponentModel.DataAnnotations;

namespace AgricultureAppBackend.Infrastructure.Models.Request;

public class UserCropTypeRequest
{
    [Required]
    public string Name { get; set; }
    
    [Required]
    public string Code { get; set; }
    
    [Required]
    public double StandardYield { get; set; }
    
    [Required]
    public double StandardProductPrice { get; set; }
    
    [Required]
    public double StandardSeedCost { get; set; }

    public string? LadCode { get; set; }
}