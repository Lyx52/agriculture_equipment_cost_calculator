using System.Text.Json.Serialization;

namespace AgricultureAppBackend.Infrastructure.Models.Json;

public class EuDataPortalModel
{
    [JsonPropertyName("OBS")]
    public string Value { get; set; }
    
    [JsonPropertyName("PERIOD")]
    public string Period { get; set; }
}