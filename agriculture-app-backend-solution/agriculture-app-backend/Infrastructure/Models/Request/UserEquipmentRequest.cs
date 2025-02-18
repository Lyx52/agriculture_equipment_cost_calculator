using System.ComponentModel.DataAnnotations;
using AgricultureAppBackend.Infrastructure.Models.Json;

namespace AgricultureAppBackend.Infrastructure.Models.Request;

public class UserEquipmentRequest
{
    [Required]
    public string Model { get; set; }
    [Required]
    public string Manufacturer { get; set; }
    [Required]
    public double Price { get; set; }
    [Required]
    public string EquipmentTypeCode { get; set; }
    [Required]
    public EquipmentSpecification Specifications { get; set; }
    [Required]
    public string PurchaseDate { get; set; }
    [Required]
    public double ExpectedAge { get; set; }
    [Required]
    public double UsageHoursPerYear { get; set; }
}