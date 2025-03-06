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
[Route("UserAdjustment")]
[Authorize]
public class UserAdjustmentController(PersistentDbContext _db, ILogger<UserEquipmentController> _logger) : Controller
{
    [HttpGet("Get")]
    public async Task<IActionResult> GetUserAdjustments()
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var result = await _db.Users.Where(u => u.Id == userId)
            .SelectMany(u => u.Adjustments)
            .OrderBy(u => u.Created)
            .ToListAsync();
        
        return Json(result, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }

    [HttpPost("Add")]
    public async Task<IActionResult> AddUserAdjustment(UserAdjustmentRequest request)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var adjustmentId = Guid.NewGuid().ToString();
        await _db.UserAdjustments.AddAsync(new UserAdjustment()
        {
            Id = adjustmentId,
            UserId = userId,
            Value = request.Value,
            Name = request.Name,
            AdjustmentTypeCode = request.AdjustmentTypeCode,
            UserFarmlandId = request.UserFarmlandId,
            Created = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();
        
        return Created();
    }
    
    [HttpDelete("Remove/{adjustmentId}")]
    public async Task<IActionResult> RemoveUserCropType([FromRoute][Required] string adjustmentId)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var adjustment = await _db.UserAdjustments.FirstOrDefaultAsync(e => e.Id == adjustmentId && e.UserId == userId);
        if (adjustment is null)
        {
            _logger.LogDebug("Adjustment with id {adjustmentId} not found", adjustmentId);
            return NotFound("User adjustment not found");
        }

        _db.UserAdjustments.Remove(adjustment);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpPost("Update/{adjustmentId}")]
    public async Task<IActionResult> UpdateUserEquipment([FromRoute][Required] string adjustmentId, [FromBody] UserAdjustmentRequest request)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        var adjustment = await _db.UserAdjustments.FirstOrDefaultAsync(e => e.Id == adjustmentId && e.UserId == userId);
        if (adjustment is null)
        {
            _logger.LogDebug("Adjustment with id {adjustmentId} not found", adjustmentId);
            return NotFound("User adjustment not found");
        }
        
        adjustment.Value = request.Value;
        adjustment.AdjustmentTypeCode = request.AdjustmentTypeCode;
        adjustment.Name = request.Name;
        adjustment.UserFarmlandId = request.UserFarmlandId;
        
        _db.UserAdjustments.Update(adjustment);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
}