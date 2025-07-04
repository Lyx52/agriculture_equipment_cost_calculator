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
    public EquipmentUsage Usage { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    public DateTime Created { get; set; }

    public List<FarmlandOperation> OperationsMachines { get; set; } = new List<FarmlandOperation>();
    public List<FarmlandOperation> OperationsTractorsOrCombines { get; set; } = new List<FarmlandOperation>();
}