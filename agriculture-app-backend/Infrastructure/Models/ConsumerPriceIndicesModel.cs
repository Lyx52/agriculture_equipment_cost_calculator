using System.Text.Json.Serialization;

namespace agriculture_app_backend.Infrastructure.Models;

public record ConsumerPriceIndexValue(string[] key, string[] values);
public class ConsumerPriceIndicesModel
{
    [JsonPropertyName("data")]
    public ConsumerPriceIndexValue[] Data { get; set; }
}