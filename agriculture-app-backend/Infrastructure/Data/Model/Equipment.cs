using System.ComponentModel.DataAnnotations;
using AgricultureAppBackend.Infrastructure.Models;

namespace AgricultureAppBackend.Infrastructure.Data.Model;

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