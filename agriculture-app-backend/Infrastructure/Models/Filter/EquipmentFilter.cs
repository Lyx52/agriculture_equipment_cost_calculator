namespace AgricultureAppBackend.Infrastructure.Models.Filter;

public class EquipmentFilter
{
    public string? EquipmentTypeCode { get; set; }
    
    public string? Model { get; set; }
    
    public string? Manufacturer { get; set; }
    
    public string? Query { get; set; }
    
    public string? PowerTrainTypeCode { get; set; }
    public int? FilterTo { get; set; }
    
    public int? MinPower { get; set; }
    
    public int? MaxPower { get; set; }
    
    public int? RequiredMinPower { get; set; }
    
    public int? RequiredMaxPower { get; set; }
}