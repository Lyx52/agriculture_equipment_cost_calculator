namespace AgricultureAppBackend.Infrastructure.Models.Filter;

public class CodifierFilter
{
    public string ParentCodifierCode { get; set;}
    public string? Query { get; set; }
    public int? FilterTo { get; set; }
    public bool? AddChildren { get; set; }
}