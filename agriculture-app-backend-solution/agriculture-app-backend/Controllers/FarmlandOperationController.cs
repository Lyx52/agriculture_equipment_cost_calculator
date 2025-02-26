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
[Route("FarmlandOperation")]
[Authorize]
public class FarmlandOperationController(PersistentDbContext _db, ILogger<UserEquipmentController> _logger) : Controller
{
    [HttpGet("Get")]
    public async Task<IActionResult> GetFarmlandOperationsByFilter([FromQuery] FarmlandOperationFilter filter)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var query = _db.UserFarmlands
            .Where(f => f.UserId == userId)
            .Include(f => f.Operations)
            .SelectMany(f => f.Operations)
            .AsQueryable();
        
        if (!string.IsNullOrEmpty(filter.FarmlandId))
        {
            query = query.Where(o => o.UserFarmlandId == filter.FarmlandId);
        }
        
        if (filter.AddCodifiers)
        {
            query = query.Include(f => f.Operation);
        }
        
        var result = await query.OrderBy(o => o.Created).ToListAsync();
        return Json(result, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }
    
    [HttpGet("{farmlandId}/GetAll")]
    public async Task<IActionResult> GetFarmlandOperations([FromRoute][Required] string farmlandId, [FromQuery] bool AddCodifiers = false)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var query = _db.UserFarmlands
            .Where(f => f.UserId == userId && f.Id == farmlandId)
            .Include(f => f.Operations)
            .SelectMany(f => f.Operations);
        
        if (AddCodifiers)
        {
            query = query.Include(f => f.Operation);
        }
        
        var result = await query.OrderBy(f => f.Created).ToListAsync();
        return Json(result, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }

    [HttpPost("{farmlandId}/Add")]
    public async Task<IActionResult> AddFarmlandOperation([FromRoute][Required] string farmlandId, FarmlandOperationRequest request)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var operationId = Guid.NewGuid().ToString();
        await _db.FarmlandOperations.AddAsync(new FarmlandOperation()
        {
            Id = operationId,
            UserFarmlandId = farmlandId,
            MachineId = request.MachineId,
            OperationCode = request.OperationCode,
            TractorOrCombineId = request.TractorOrCombineId,
            Created = DateTime.UtcNow
        });
        
        await _db.SaveChangesAsync();
        
        return Created();
    }
    
    [HttpDelete("{farmlandId}/Remove/{operationId}")]
    public async Task<IActionResult> RemoveUserFarmland([FromRoute][Required] string farmlandId, [FromRoute][Required] string operationId)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var operation = await _db.FarmlandOperations
            .Include(f => f.UserFarmland)
            .FirstOrDefaultAsync(e => e.Id == operationId && e.UserFarmland.UserId == userId && e.UserFarmlandId == farmlandId);
        
        if (operation is null)
        {
            _logger.LogDebug("Operation with id {operationId} not found", operationId);
            return NotFound("Farmland operation not found");
        }

        _db.FarmlandOperations.Remove(operation);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpPost("{farmlandId}/Update/{operationId}")]
    public async Task<IActionResult> UpdateUserEquipment([FromRoute][Required] string farmlandId, [FromRoute][Required] string operationId,  [FromBody] FarmlandOperationRequest request)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        var operation = await _db.FarmlandOperations
            .Include(f => f.UserFarmland)
            .FirstOrDefaultAsync(e => e.Id == operationId && e.UserFarmland.UserId == userId && e.UserFarmlandId == farmlandId);
        
        if (operation is null)
        {
            _logger.LogDebug("Operation with id {operationId} not found", operationId);
            return NotFound("Farmland operation not found");
        }


        operation.OperationCode = request.OperationCode;
        operation.MachineId = request.MachineId;
        operation.TractorOrCombineId = request.TractorOrCombineId;

        _db.FarmlandOperations.Update(operation);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
}