using System.ComponentModel.DataAnnotations;
using AgricultureAppBackend.Infrastructure.Models.Json;

namespace AgricultureAppBackend.Infrastructure.Database.Model;

public class UserEquipment
{
    [Key]
    public string Id { get; set; }
    
    public string Model { get; set; }
    
    public string Manufacturer { get; set; }
    
    public double Price { get; set; }
    
    public string EquipmentTypeCode { get; set; }
    
    public EquipmentSpecification Specifications { get; set; }
    public string PurchaseDate { get; set; }
    public double ExpectedAge { get; set; }
    public double UsageHoursPerYear { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
}