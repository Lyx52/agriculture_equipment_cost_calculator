using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgricultureAppBackend.Infrastructure.Database.Model;

public class Codifier
{
    [Key]
    public string Code { get; set; }
    
    public string Name { get; set; }
    
    public string? Value { get; set; }
    
    public string? ParentCode { get; set; }
    
    [ForeignKey(nameof(ParentCode))]
    public Codifier? Parent { get; set; }
    
    public List<Codifier> Children { get; set; } = new();
    
    // Refs
    public List<FarmlandOperation> Operations { get; set; } = new List<FarmlandOperation>();

    public List<UserAdjustment> Adjustments { get; set; } = new List<UserAdjustment>();
}