using System.Text.Json.Serialization;

namespace agriculture_app_backend.Infrastructure.Models;

public class EuDataPortalModel
{
    [JsonPropertyName("OBS")]
    public string Value { get; set; }
    
    [JsonPropertyName("PERIOD")]
    public string Period { get; set; }
}