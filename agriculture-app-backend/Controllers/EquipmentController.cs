using System.Text.Json;
using agriculture_app_backend.Infrastructure.Data;
using agriculture_app_backend.Infrastructure.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace agriculture_app_backend.Controllers;

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

        var result = await query.ToListAsync();
        return Json(result, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }
}