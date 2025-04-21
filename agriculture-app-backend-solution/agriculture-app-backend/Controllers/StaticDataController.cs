using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace AgricultureAppBackend.Controllers;

[ApiController]
[Route("StaticData")]
[Authorize]
public class StaticDataController(IMemoryCache _memoryCache) : Controller
{
    private const string HoursByYearStaticData = nameof(HoursByYearStaticData);
    
    [HttpGet("HoursByYear")]
    public async Task<IActionResult> GetMotorHoursByYear()
    {
        var cachedValue = await _memoryCache.GetOrCreateAsync<Dictionary<string, Dictionary<string, float>>>(HoursByYearStaticData, async (cacheValue) =>
        {
            using var fs = System.IO.File.OpenRead("seed/mascus/mascus_hours.json");
            var data = JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, float>>>(fs);
            cacheValue
                .SetValue(data)
                .SetAbsoluteExpiration(DateTimeOffset.Now.AddHours(8));
            return data;
        });
        
        if (cachedValue is null)
        {
            return StatusCode(500, "Failed to request mascus hours data");
        }
        
        return Json(cachedValue, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }
}