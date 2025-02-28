namespace AgricultureAppBackend.Infrastructure.Models.Response;

public class InflationBetweenYearsResponse
{
    public int StartYear { get; set; }
    public int EndYear { get; set; }
    public double InflationChange { get; set; }
}