using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text.Json;
using AgricultureAppBackend.Infrastructure.Database;
using AgricultureAppBackend.Infrastructure.Database.Model;
using AgricultureAppBackend.Infrastructure.Models.Filter;
using AgricultureAppBackend.Infrastructure.Models.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgricultureAppBackend.Controllers;

[ApiController]
[Route("UserFarmland")]
[Authorize]
public class UserFarmlandController(PersistentDbContext _db, ILogger<UserEquipmentController> _logger) : Controller
{
    [HttpGet("Get")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> GetUserFarmlands([FromQuery] bool AddOperations = false, [FromQuery] bool AddCodifiers = false)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var query = _db.Users.Where(u => u.Id == userId).SelectMany(u => u.Farmlands);

        if (AddOperations && AddCodifiers)
        {
            query = query.Include(f => f.Operations).ThenInclude(o => o.Operation);
        } else if (AddOperations)
        {
            query = query.Include(f => f.Operations);
        }
        if (AddCodifiers)
        {
            query = query.Include(f => f.Product);
        }
        
        var result = await query.ToListAsync();
        return Json(result, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }

    [HttpPost("Add")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> AddUserFarmland(UserFarmlandRequest request)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        await _db.UserFarmlands.AddAsync(new UserFarmland()
        {
            UserId = userId,
            Id = request.Id ?? Guid.NewGuid().ToString(),
            ProductCode = request.ProductCode,
            Area = request.Area,
            Operations = new List<FarmlandOperation>()
        });
        await _db.SaveChangesAsync();
        
        return Created();
    }
    
    [HttpDelete("Remove/{farmlandId}")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> RemoveUserFarmland([FromRoute][Required] string farmlandId)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var farmland = await _db.UserFarmlands.FirstOrDefaultAsync(e => e.Id == farmlandId && e.UserId == userId);
        if (farmland is null)
        {
            _logger.LogDebug("Farmland with id {farmlandId} not found", farmlandId);
            return NotFound("User farmland not found");
        }

        _db.UserFarmlands.Remove(farmland);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpPost("Update/{farmlandId}")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> UpdateUserEquipment([FromRoute][Required] string farmlandId, [FromBody] UserFarmlandRequest request)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        var farmland = await _db.UserFarmlands.FirstOrDefaultAsync(e => e.Id == farmlandId && e.UserId == userId);
        if (farmland is null)
        {
            _logger.LogDebug("Farmland with id {farmlandId} not found", farmlandId);
            return NotFound("User farmland not found");
        }

        farmland.Area = request.Area;
        farmland.ProductCode = request.ProductCode;

        _db.UserFarmlands.Update(farmland);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
}