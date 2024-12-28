namespace agriculture_app_backend.Infrastructure.Converters;

using System.Text.Json;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

public class JsonValueConverter<T>(ConverterMappingHints? mappingHints = null) : ValueConverter<T, string?>(
    v => v == null ? null : JsonSerializer.Serialize(v, new JsonSerializerOptions()),
    v => v == null ? default! : JsonSerializer.Deserialize<T>(v, 
        new JsonSerializerOptions()
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        }
    )!,
    mappingHints)
{
    
}