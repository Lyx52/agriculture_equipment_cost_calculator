using System.Text.Json;
using AgricultureAppBackend.Infrastructure.Data;
using AgricultureAppBackend.Infrastructure.Data.Model;
using AgricultureAppBackend.Infrastructure.Models.Filter;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgricultureAppBackend.Controllers;

[ApiController]
[Route("Codifier")]
public class CodifierController(PersistentDbContext _db) : Controller
{
    [HttpGet("ByCode/{codifierCode}")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> GetCodifiersByCode([FromRoute] string codifierCode)
    {
        if (string.IsNullOrEmpty(codifierCode))
        {
            return BadRequest("codifierCode is required");
        }

        var codifierValue = await _db.Set<Codifier>()
            .Select(c => new
            {
                Name = c.Name,
                Code = c.Code,
                ParentCode = c.ParentCode,
                Value = c.Value
            })
            .FirstOrDefaultAsync(c => c.Code == codifierCode);
        
        return Json(codifierValue, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }
    [HttpGet]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> GetCodifiersByParentCode([FromQuery] CodifierFilter filter)
    {
        var parentCodifierCodes = filter.ParentCodifierCode.Split(','); 
        if (parentCodifierCodes.Length <= 0)
        {
            return BadRequest("ParentCodifierCode is required");
        }
        
        var query = _db.Set<Codifier>()
            .Where(c => parentCodifierCodes.Contains(c.ParentCode)).AsQueryable();
        
        if (!string.IsNullOrEmpty(filter.Query))
        {
            query = query.Where(c => c.Name.ToLower().Contains(filter.Query.ToLower()));
        }
        
        if (filter.FilterTo.HasValue)
        {
            query = query.Take(filter.FilterTo.Value);
        }

        if (filter.AddChildren.HasValue && filter.AddChildren.Value)
        {
            query = query.Include(c => c.Children);
        }
        
        var result = await query.Select(c => new
        {
            Name = c.Name,
            Code = c.Code,
            ParentCode = c.ParentCode,
            Value = c.Value,
            Children = c.Children.Select(cc => new
            {
                Name = cc.Name,
                Code = cc.Code,
                Value = cc.Value,
                ParentCode = cc.ParentCode,
            })
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