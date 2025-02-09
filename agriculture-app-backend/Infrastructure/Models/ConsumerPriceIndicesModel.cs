using System.Text.Json.Serialization;

namespace AgricultureAppBackend.Infrastructure.Models;

public record ConsumerPriceIndexValue(string[] key, string[] values);
public class ConsumerPriceIndicesModel
{
    [JsonPropertyName("data")]
    public ConsumerPriceIndexValue[] Data { get; set; }
}