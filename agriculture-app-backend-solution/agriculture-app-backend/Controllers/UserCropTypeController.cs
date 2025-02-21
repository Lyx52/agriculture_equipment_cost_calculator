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
[Route("UserCropType")]
[Authorize]
public class UserCropTypeController(PersistentDbContext _db, ILogger<UserEquipmentController> _logger) : Controller
{
    [HttpGet("Get")]
    public async Task<IActionResult> GetUserCropType()
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var result = await _db.Users.Where(u => u.Id == userId)
            .SelectMany(u => u.CropTypes)
            .ToListAsync();
        
        return Json(result, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }

    [HttpPost("Add")]
    public async Task<IActionResult> AddUserCropType(UserCropTypeRequest request)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var cropTypeId = Guid.NewGuid().ToString();
        await _db.UserCropTypes.AddAsync(new UserCropType()
        {
            UserId = userId,
            Code = request.Code,
            Name = request.Name,
            LadCode = request.LadCode,
            StandardYield = request.StandardYield,
            StandardProductPrice = request.StandardProductPrice,
            StandardSeedCost = request.StandardSeedCost,
            Id = cropTypeId,
        });
        await _db.SaveChangesAsync();
        
        return Created();
    }
    
    [HttpDelete("Remove/{cropTypeId}")]
    public async Task<IActionResult> RemoveUserCropType([FromRoute][Required] string cropTypeId)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var cropType = await _db.UserCropTypes.FirstOrDefaultAsync(e => e.Id == cropTypeId && e.UserId == userId);
        if (cropType is null)
        {
            _logger.LogDebug("CropType with id {cropTypeId} not found", cropTypeId);
            return NotFound("User crop type not found");
        }

        _db.UserCropTypes.Remove(cropType);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpDelete("Remove/All")]
    public async Task<IActionResult> RemoveAllUserCropType()
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var cropTypes = await _db.UserCropTypes.Where(e => e.UserId == userId).ToListAsync();
        _db.UserCropTypes.RemoveRange(cropTypes);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpPost("Update/{cropTypeId}")]
    public async Task<IActionResult> UpdateUserEquipment([FromRoute][Required] string cropTypeId, [FromBody] UserCropTypeRequest request)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        var cropType = await _db.UserCropTypes.FirstOrDefaultAsync(e => e.Id == cropTypeId && e.UserId == userId);
        if (cropType is null)
        {
            _logger.LogDebug("CropType with id {cropTypeId} not found", cropTypeId);
            return NotFound("User crop type not found");
        }
        
        cropType.StandardYield = request.StandardYield;
        cropType.StandardProductPrice = request.StandardProductPrice;
        cropType.StandardSeedCost = request.StandardSeedCost;
        
        _db.UserCropTypes.Update(cropType);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
}