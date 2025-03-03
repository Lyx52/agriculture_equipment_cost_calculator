using System.ComponentModel.DataAnnotations;

namespace AgricultureAppBackend.Infrastructure.Database.Model;

public class FarmlandOperation
{
    [Key]
    public string Id { get; set; }
    
    public string? TractorOrCombineId { get; set; }
    public UserEquipment? TractorOrCombine { get; set; }
    
    public string? MachineId { get; set; }
    public UserEquipment? Machine { get; set; }
    
    public string? OperationCode { get; set; }
    public Codifier? Operation { get; set; }
    
    public string UserFarmlandId { get; set; }
    public UserFarmland UserFarmland { get; set; }
    
    public string? EmployeeId { get; set; }
    public UserAdjustment? Employee { get; set; }
    public DateTime Created { get; set; }
}