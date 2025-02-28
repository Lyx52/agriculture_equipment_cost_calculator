using System.Text.Json.Serialization;

namespace AgricultureAppBackend.Infrastructure.Models.Json;

public record ChartPeriodData(string period, double index_value);

public record ChartData(ChartPeriodData[] data);

public record CSBDataModel(ChartData chart);

public class CSBCpiChangeModel
{
    [JsonPropertyName("data")]
    public CSBDataModel Data { get; set; }    
}