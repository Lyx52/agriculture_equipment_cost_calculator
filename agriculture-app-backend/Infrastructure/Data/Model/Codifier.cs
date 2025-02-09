using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgricultureAppBackend.Infrastructure.Data.Model;

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
}