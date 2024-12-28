using System.ComponentModel.DataAnnotations;

namespace agriculture_app_backend.Infrastructure.Models;

public class Equipment
{
    [Key]
    public int Id { get; set; }
    
    public string Model { get; set; }
    
    public string Manufacturer { get; set; }
    
    public double Price { get; set; }
    
    public string EquipmentTypeCode { get; set; }
    
    public EquipmentSpecification Specifications { get; set; }
}