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
[Route("UserEquipment")]
[Authorize]
public class UserEquipmentController(PersistentDbContext _db, ILogger<UserEquipmentController> _logger) : Controller
{
    [HttpGet("Get")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> GetUserEquipment()
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
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

    [HttpPost("Add")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> AddUserEquipment(UserEquipmentRequest request)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var equipmentId = Guid.NewGuid().ToString();
        await _db.UserEquipment.AddAsync(new UserEquipment()
        {
            UserId = userId,
            Manufacturer = request.Manufacturer,
            EquipmentTypeCode = request.EquipmentTypeCode,
            Model = request.Model,
            Specifications = request.Specifications,
            Price = request.Price,
            Id = equipmentId
        });
        await _db.SaveChangesAsync();
        
        return Created();
    }
    
    [HttpDelete("Remove/{equipmentId}")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> RemoveUserEquipment([FromRoute][Required] string equipmentId)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var equipment = await _db.UserEquipment.FirstOrDefaultAsync(e => e.Id == equipmentId && e.UserId == userId);
        if (equipment is null)
        {
            _logger.LogDebug("Equipment with id {equipmentId} not found", equipmentId);
            return NotFound("User equipment not found");
        }

        _db.UserEquipment.Remove(equipment);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpPost("Update/{equipmentId}")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> UpdateUserEquipment([FromRoute][Required] string equipmentId, [FromBody] UserEquipmentRequest request)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        var equipment = await _db.UserEquipment.FirstOrDefaultAsync(e => e.Id == equipmentId && e.UserId == userId);
        if (equipment is null)
        {
            _logger.LogDebug("Equipment with id {equipmentId} not found", equipmentId);
            return NotFound("User equipment not found");
        }

        equipment.EquipmentTypeCode = request.EquipmentTypeCode;
        equipment.Manufacturer = request.Manufacturer;
        equipment.Model = request.Model;
        equipment.Price = request.Price;
        equipment.Specifications = request.Specifications;

        _db.UserEquipment.Update(equipment);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
}