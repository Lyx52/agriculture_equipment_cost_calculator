using System.Text.Json.Serialization;

namespace AgricultureAppBackend.Infrastructure.Models.Json;

public class ProductCropParameterModel
{
    [JsonPropertyName("code")]
    public string Code { get; set; }
    
    [JsonPropertyName("standard_yield")]
    public double StandardYield { get; set; }
    
    [JsonPropertyName("standard_product_price")]
    public double StandardProductPrice { get; set; }
    
    [JsonPropertyName("standard_seed_cost")]
    public double StandardSeedCost { get; set; }
    
    [JsonPropertyName("standard_field_usage")]
    public double StandardFieldUsage { get; set; }
}