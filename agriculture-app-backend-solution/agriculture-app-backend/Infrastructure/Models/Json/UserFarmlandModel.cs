namespace AgricultureAppBackend.Infrastructure.Models.Json;

public class UserFarmlandModel
{
    public string Id { get; set; }
    public double Area { get; set; }
    public string? ProductCode { get; set; }
    public string? ProductName { get; set; }
    public string? Title { get; set; }
    public int? Year { get; set; }
}