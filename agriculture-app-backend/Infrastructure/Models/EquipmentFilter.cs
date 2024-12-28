namespace agriculture_app_backend.Infrastructure.Models;

public class EquipmentFilter
{
    public string? EquipmentTypeCode { get; set; }
    
    public string? Model { get; set; }
    
    public string? Manufacturer { get; set; }
    
    public string? Query { get; set; }
    
    public string? PowerTrainTypeCode { get; set; }
}