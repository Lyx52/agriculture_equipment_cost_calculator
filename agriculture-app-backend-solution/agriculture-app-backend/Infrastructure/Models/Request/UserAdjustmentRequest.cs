using System.ComponentModel.DataAnnotations;
using AgricultureAppBackend.Infrastructure.Models.Json;

namespace AgricultureAppBackend.Infrastructure.Models.Request;

public class UserAdjustmentRequest
{
    [Required]
    public string Name { get; set; }
    
    [Required]
    public string AdjustmentTypeCode { get; set; }
    
    [Required]
    public double Value { get; set; }
    
    public string? UserFarmlandId { get; set; }
}