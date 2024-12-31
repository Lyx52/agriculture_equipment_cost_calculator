using System.Text.Json;
using agriculture_app_backend.Infrastructure.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace agriculture_app_backend.Controllers;

[ApiController]
[Route("Indicators")]
public class IndicatorController(IMemoryCache _memoryCache, IHttpClientFactory _httpClientFactory) : Controller
{
    private const string InflationData = nameof(InflationData);
    private const string InterestData = nameof(InterestData);
    
    [HttpGet("Inflation")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> GetInflation()
    {
        var cachedValue = await _memoryCache.GetOrCreateAsync<string>(InflationData, async (cacheValue) =>
        {
            var client = _httpClientFactory.CreateClient(InflationData);
        
            var response = await client.GetAsync("https://data.ecb.europa.eu/data-detail-api/ICP.M.LV.N.000000.4.ANR");
            var data = await response.Content.ReadAsStringAsync();
            cacheValue
                .SetValue(data)
                .SetAbsoluteExpiration(DateTimeOffset.Now.AddDays(1));
            return data;
        });
        
        if (string.IsNullOrEmpty(cachedValue))
        {
            return StatusCode(500, "Failed to request inflation metrics");
        }

        var result = JsonSerializer.Deserialize<EuDataPortalModel[]>(cachedValue);
        
        if (result is null)
        {
            return StatusCode(500, "Failed to request inflation metrics");
        }

        var inflation = result
            .Select(item => new { Value = double.Parse(item.Value), Period = item.Period })
            .First();
        
        return Json(inflation, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }
    
    [HttpGet("InterestRate")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> GetInterestRate()
    {
        var cachedValue = await _memoryCache.GetOrCreateAsync<string>(InterestData, async (cacheValue) =>
        {
            var client = _httpClientFactory.CreateClient(InterestData);
        
            var response = await client.GetAsync("https://data.ecb.europa.eu/data-detail-api/MIR.M.LV.B.A2I.AM.R.A.2240.EUR.N");
            var data = await response.Content.ReadAsStringAsync();
            cacheValue
                .SetValue(data)
                .SetAbsoluteExpiration(DateTimeOffset.Now.AddDays(1));
            return data;
        });
        
        if (string.IsNullOrEmpty(cachedValue))
        {
            return StatusCode(500, "Failed to request interest rate metrics");
        }

        var result = JsonSerializer.Deserialize<EuDataPortalModel[]>(cachedValue);
        
        if (result is null)
        {
            return StatusCode(500, "Failed to request interest rate metrics");
        }

        var interest = result
            .Select(item => new { Value = double.Parse(item.Value), Period = item.Period })
            .First();
        
        return Json(interest, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }
}