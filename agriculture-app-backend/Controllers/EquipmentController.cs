using System.Text.Json;
using AgricultureAppBackend.Infrastructure.Data;
using AgricultureAppBackend.Infrastructure.Data.Model;
using AgricultureAppBackend.Infrastructure.Models.Filter;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgricultureAppBackend.Controllers;

[ApiController]
[Route("Equipment")]
public class EquipmentController(PersistentDbContext _db) : Controller
{
    [HttpGet]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> GetEquipmentByFilters([FromQuery] EquipmentFilter filter)
    {
        var query = _db.Set<Equipment>().AsQueryable();
        var equipmentTypesCodes = filter.EquipmentTypeCode?.Split(',') ?? [];
        if (equipmentTypesCodes.Length > 0)
        {
            query = query.Where(e => equipmentTypesCodes.Contains(e.EquipmentTypeCode));
        }
        if (!string.IsNullOrEmpty(filter.Manufacturer))
        {
            query = query.Where(e => e.Manufacturer.ToLower().Contains(filter.Manufacturer.ToLower()));
        }
        if (!string.IsNullOrEmpty(filter.Model))
        {
            query = query.Where(e => e.Model.ToLower().Contains(filter.Model.ToLower()));
        }
        if (!string.IsNullOrEmpty(filter.Query))
        {
            query = query.Where(e => (e.Manufacturer + " " + e.Model).ToLower().Contains(filter.Query.ToLower()));
        }
        if (!string.IsNullOrEmpty(filter.PowerTrainTypeCode))
        {
            query = query.Where(e => e.Specifications.PowerTrainCode == filter.PowerTrainTypeCode);
        }
      
        if (filter.FilterTo.HasValue)
        {
            query = query.Take(filter.FilterTo.Value);
        }

        if (filter.MinPower.HasValue)
        {
            query = query.Where(e => !e.Specifications.Power.HasValue || e.Specifications.Power >= filter.MinPower.Value);
        }

        if (filter.MaxPower.HasValue)
        {
            query = query.Where(e => !e.Specifications.Power.HasValue || e.Specifications.Power <= filter.MaxPower.Value);
        }
        
        if (filter.RequiredMinPower.HasValue)
        {
            query = query.Where(e => !e.Specifications.RequiredPower.HasValue || e.Specifications.RequiredPower >= filter.RequiredMinPower.Value);
        }

        if (filter.RequiredMaxPower.HasValue)
        {
            query = query.Where(e => !e.Specifications.RequiredPower.HasValue || e.Specifications.RequiredPower <= filter.RequiredMaxPower.Value);
        }
        
        var result = await query.ToListAsync();
        return Json(result, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }

    [HttpGet("ByUserId/{userId}")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> GetEquipmentByUserId([FromRoute] string userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest("UserId is required!");
        }

        var result = await _db.Users.Where(u => u.Id == userId)
            .SelectMany(u => u.Equipment)
            .ToListAsync();
        
        return Json(result, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }
}