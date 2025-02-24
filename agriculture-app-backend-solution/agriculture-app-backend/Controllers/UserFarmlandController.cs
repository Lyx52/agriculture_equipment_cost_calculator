using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text.Json;
using AgricultureAppBackend.Infrastructure.Constants;
using AgricultureAppBackend.Infrastructure.Database;
using AgricultureAppBackend.Infrastructure.Database.Model;
using AgricultureAppBackend.Infrastructure.Models.Filter;
using AgricultureAppBackend.Infrastructure.Models.Json;
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
    public async Task<IActionResult> GetUserFarmlands([FromQuery] bool AddOperations = false, [FromQuery] bool AddCropTypes = false)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var query = _db.Users.Where(u => u.Id == userId)
            .SelectMany(u => u.Farmlands)
            .Include(f => f.ProductCropType).AsQueryable();

        if (AddOperations)
        {
            query = query.Include(f => f.Operations);
        }
        
        var result = await query.Select(f => new UserFarmlandModel()
        {
            Id = f.Id,
            Area = f.Area,
            ProductCode = f.ProductCropType.Code,
            ProductName = f.ProductCropType.Name
        }).ToListAsync();
        return Json(result, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }

    [HttpPost("Add")]
    public async Task<IActionResult> AddUserFarmland(UserFarmlandRequest request)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        // First try to query for existing UserCropType

        var userCropTypeId = await CreateOrGetUserCropType(request.ProductCode, request.ProductName, userId);
        if (string.IsNullOrEmpty(userCropTypeId))
        {
            return ValidationProblem(Utils.ToValidationProblem("PRODUCT_DOES_NOT_EXIST", "Product does not exist!"));
        }
        
        await _db.UserFarmlands.AddAsync(new UserFarmland()
        {
            UserId = userId,
            Id = string.IsNullOrEmpty(request.Id) ? Guid.NewGuid().ToString() : request.Id,
            ProductCropTypeId = userCropTypeId,
            Area = request.Area,
            Operations = new List<FarmlandOperation>()
        });
        await _db.SaveChangesAsync();
        
        return Created();
    }
    
    [HttpDelete("Remove/{farmlandId}")]
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

        var userCropTypeId = await CreateOrGetUserCropType(request.ProductCode, request.ProductName, userId);
        if (string.IsNullOrEmpty(userCropTypeId))
        {
            return ValidationProblem(Utils.ToValidationProblem("PRODUCT_DOES_NOT_EXIST", "Product does not exist!"));
        }
        
        farmland.Area = request.Area;
        farmland.ProductCropTypeId = userCropTypeId;

        _db.UserFarmlands.Update(farmland);
        await _db.SaveChangesAsync();
        
        return Ok();
    }

    private async Task<string?> CreateOrGetUserCropType(string productCode, string? productName, string userId)
    {
        // Existing
        var userCropType = await _db.UserCropTypes.FirstOrDefaultAsync(c => c.Code == productCode && c.UserId == userId);
        if (userCropType is not null)
        {
            return userCropType.Id;
        }
        
        var productCodifier = await _db.Codifiers.FirstOrDefaultAsync(c => c.Code == productCode);
        if (productCodifier is null && string.IsNullOrEmpty(productName))
        {
            return null;
        }
        
        // New from productCode, productName
        var userCropTypeId = Guid.NewGuid().ToString();
        if (productCodifier is null)
        {
            await _db.UserCropTypes.AddAsync(new UserCropType()
            {
                Id = userCropTypeId,
                Code = productCode,
                LadCode = productCode.Replace("crop_", string.Empty),
                Name = productName!,
                StandardSeedCost = 0.25,
                StandardFieldUsage = 1,
                StandardYield = 1,
                StandardProductPrice = 100,
                IsCustom = true,
                UserId = userId
            });
            await _db.SaveChangesAsync();
            return productCode;
        }
        
        // New from codifier
        ProductCropParameterModel? cropTypesValues = null;
        try
        {
            cropTypesValues = JsonSerializer.Deserialize<ProductCropParameterModel>(productCodifier.Value ?? "");
        }
        catch
        {
            // ignored
        }

        await _db.UserCropTypes.AddAsync(new UserCropType()
        {
            Id = userCropTypeId,
            Code = productCodifier.Code,
            LadCode = cropTypesValues?.Code ?? productCodifier.Code.Replace("crop_", string.Empty),
            Name = productCodifier.Name,
            StandardSeedCost = cropTypesValues?.StandardSeedCost ?? 0.25,
            StandardFieldUsage = cropTypesValues?.StandardFieldUsage ?? 1,
            StandardYield = cropTypesValues?.StandardYield ?? 1,
            StandardProductPrice = cropTypesValues?.StandardProductPrice ?? 100,
            IsCustom = cropTypesValues?.Code is null,
            UserId = userId
        });
        await _db.SaveChangesAsync();
        return userCropTypeId;
    }
}