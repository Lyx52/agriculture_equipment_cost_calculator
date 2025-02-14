using System.ComponentModel.DataAnnotations;
using AgricultureAppBackend.Infrastructure.Models;
using AgricultureAppBackend.Infrastructure.Models.Json;

namespace AgricultureAppBackend.Infrastructure.Database.Model;

public class Equipment
{
    [Key]
    public int Id { get; set; }
    
    public string Model { get; set; }
    
    public string Manufacturer { get; set; }
    
    public double Price { get; set; }
    
    public string EquipmentTypeCode { get; set; }
    
    public EquipmentSpecification Specifications { get; set; }
    
    public List<User> Users { get; set; } = new List<User>();
}