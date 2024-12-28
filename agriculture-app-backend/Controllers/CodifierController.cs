using System.Text.Json;
using agriculture_app_backend.Infrastructure.Data;
using agriculture_app_backend.Infrastructure.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace agriculture_app_backend.Controllers;

[ApiController]
[Route("Codifier")]
public class CodifierController(PersistentDbContext _db) : Controller
{
    [HttpGet]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> GetCodifiersByParentCode([FromQuery] CodifierFilter filter)
    {
        
        if (string.IsNullOrEmpty(filter.ParentCodifierCode))
        {
            return BadRequest("ParentCodifierCode is required");
        }
        
        var query = _db.Set<Codifier>()
            .Where(c => c.ParentCode == filter.ParentCodifierCode).AsQueryable();
        
        if (!string.IsNullOrEmpty(filter.Query))
        {
            query = query.Where(c => c.Name.ToLower().Contains(filter.Query.ToLower()));
        }
        
        if (filter.FilterTo.HasValue)
        {
            query = query.Take(filter.FilterTo.Value);
        }
        
        var result = await query.Select(c => new
        {
            Name = c.Name,
            Code = c.Code,
            ParentCode = c.ParentCode,
            Value = c.Value
        })
        .ToListAsync();
        
        return Json(result, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }
}