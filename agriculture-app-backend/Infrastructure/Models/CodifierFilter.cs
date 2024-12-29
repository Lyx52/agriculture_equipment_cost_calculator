namespace agriculture_app_backend.Infrastructure.Models;

public class CodifierFilter
{
    public string ParentCodifierCode { get; set;}
    public string? Query { get; set; }
    public int? FilterTo { get; set; }
    public bool? AddChildren { get; set; }
}