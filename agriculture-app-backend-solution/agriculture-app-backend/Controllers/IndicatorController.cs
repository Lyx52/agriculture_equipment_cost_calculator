using System.Globalization;
using System.Text.Json;
using AgricultureAppBackend.Infrastructure.Constants;
using AgricultureAppBackend.Infrastructure.Models;
using AgricultureAppBackend.Infrastructure.Models.Json;
using AgricultureAppBackend.Infrastructure.Models.Response;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace AgricultureAppBackend.Controllers;

[ApiController]
[Route("Indicators")]
public class IndicatorController(IMemoryCache _memoryCache, IHttpClientFactory _httpClientFactory) : Controller
{
    private const string InflationData = nameof(InflationData);
    private const string InflationBetweenData = nameof(InflationBetweenData);
    private const string InterestData = nameof(InterestData);
    private const string ConsumerPriceIndicesData = nameof(ConsumerPriceIndicesData);

    [HttpGet("InflationBetween/{startYear}/{endYear}")]
    public async Task<IActionResult> GetInflationBetween(int startYear, int endYear)
    {
        var currentYear = DateTime.UtcNow.Year;
        if (startYear < 2000 || endYear > currentYear)
        {
            return ValidationProblem(Utils.ToValidationProblem("INVALID_YEARS", "Invalid start or end year"));
        }
        
        var cacheKey = $"{InflationBetweenData}_{startYear}_{endYear}";
        
        var cachedValue = await _memoryCache.GetOrCreateAsync<InflationBetweenYearsResponse?>(cacheKey, async (cacheValue) =>
        {
            if (startYear == endYear)
            {
                var value = new InflationBetweenYearsResponse()
                {
                    StartYear = startYear,
                    EndYear = endYear,
                    InflationChange = 0
                };
                
                cacheValue
                    .SetValue(value)
                    .SetAbsoluteExpiration(DateTimeOffset.Now.AddDays(30));
                
                return value;
            }
            var client = _httpClientFactory.CreateClient(InflationBetweenData);
            
            var response = await client.GetAsync($"https://tools.csb.gov.lv/cpi_calculator/php_service/index.php?db=dataByTime&lang=lv&time_from={startYear}M01&time_to={endYear}M01&code=0&multiplier=100");
            var data = await response.Content.ReadAsStringAsync();
            
            var inflationData = JsonSerializer.Deserialize<CSBCpiChangeModel>(data);

            if (inflationData is null) return null;
            var changesPerYear = inflationData.Data.chart.data
                .Select(v => new
                {
                    Value = v.index_value,
                    Date = DateTime.ParseExact(v.period.Replace('M', '-') + "-01", "yyyy-MM-dd",
                        CultureInfo.InvariantCulture)
                })
                .Where(v => v.Date.Year > startYear && v.Date.Year <= endYear)
                .GroupBy(v => v.Date.Year)
                .OrderBy(v => v.Key)
                .Last()
                .ToList();
            
            var result = new InflationBetweenYearsResponse()
            {
                StartYear = startYear,
                EndYear = endYear,
                InflationChange = changesPerYear.Average(v => v.Value)
            };
            cacheValue
                .SetValue(result)
                .SetAbsoluteExpiration(DateTimeOffset.Now.AddDays(7));

            return result;
        });
        
        if (cachedValue is null)
        {
            return StatusCode(500, "Failed to request inflation metrics");
        }
        
        return Json(cachedValue, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }
    
    [HttpGet("Inflation")]
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
    public async Task<IActionResult> GetInterestRate()
    {
        var cachedValue = await _memoryCache.GetOrCreateAsync<string>(InterestData, async (cacheValue) =>
        {
            var client = _httpClientFactory.CreateClient(InterestData);
        
            var response = await client.GetAsync("https://data.ecb.europa.eu/data-detail-api/MIR.M.U2.B.A2I.AM.R.A.2240.EUR.N");
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
    
    [HttpGet("ConsumerPriceIndices")]
    public async Task<IActionResult> GetConsumerPriceIndices()
    {
        var cachedValue = await _memoryCache.GetOrCreateAsync<string>(ConsumerPriceIndicesData, async (cacheValue) =>
        {
            var client = _httpClientFactory.CreateClient(ConsumerPriceIndicesData);
            var postData = JsonSerializer.Deserialize<object>(
                """
                {
                  "query": [
                    {
                      "code": "ECOICOP",
                      "selection": {
                        "filter": "vs:VS_ECOICOP",
                        "values": [
                          "07"
                        ]
                      }
                    },
                    {
                      "code": "ContentsCode",
                      "selection": {
                        "filter": "item",
                        "values": [
                          "PCI020m"
                        ]
                      }
                    },
                    {
                      "code": "TIME",
                      "selection": {
                        "filter": "all",
                        "values": [
                          "*M01",
                          "*M02",
                          "*M03",
                          "*M04",
                          "*M05",
                          "*M06",
                          "*M07",
                          "*M08",
                          "*M09",
                          "*M10",
                          "*M11",
                          "*M12"
                        ]
                      }
                    }
                  ],
                  "response": {
                    "format": "JSON"
                  }
                }
                """
            );
            var response = await client.PostAsJsonAsync("https://data.stat.gov.lv:443/api/v1/en/OSP_PUB/START/VEK/PC/PCI/PCI020m", postData);
            var data = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<ConsumerPriceIndicesModel>(data);

            if (result is null) return string.Empty;

            var resultView = result.Data.GroupBy(
                value => value.key[1].Substring(0, 4),
                value => float.TryParse(value.values[0], out var index) ? index : -1
            ).ToDictionary(
                value => value.Key,
                value => value.Where(v => v >= 0).Average()
            );

            var cachedJson = JsonSerializer.Serialize(resultView);
            
            cacheValue
                .SetValue(cachedJson)
                .SetAbsoluteExpiration(DateTimeOffset.Now.AddDays(15));
            return cachedJson;
        });
        
        if (string.IsNullOrEmpty(cachedValue))
        {
            return StatusCode(500, "Failed to request consumer price indices metrics");
        }

        var result = JsonSerializer.Deserialize<Dictionary<string, float>>(cachedValue);
        
        if (result is null)
        {
            return StatusCode(500, "Failed to request consumer price indices metrics");
        }

        
        return Json(result, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }
}