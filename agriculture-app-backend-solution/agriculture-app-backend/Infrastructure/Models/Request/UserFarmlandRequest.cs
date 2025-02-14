namespace AgricultureAppBackend.Infrastructure.Models.Request;

public class UserFarmlandRequest
{
    public string? Id { get; set; }
    public double Area { get; set; }
    public string? ProductCode { get; set; }
}