using System.ComponentModel.DataAnnotations;

namespace AgricultureAppBackend.Infrastructure.Models.Request;

public class UserFarmlandRequest
{
    public string? Id { get; set; }
    [Required]
    public double Area { get; set; }
    [Required]
    public string ProductCode { get; set; }
    public string? ProductName { get; set; }
}