using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using AgricultureAppBackend.Infrastructure.Constants;
using AgricultureAppBackend.Infrastructure.Database.Model;
using AgricultureAppBackend.Infrastructure.Models.Request;
using AgricultureAppBackend.Infrastructure.Models.Response;
using AgricultureAppBackend.Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace AgricultureAppBackend.Controllers;

[ApiController]
[Route("Auth")]
public class AuthController(UserManager<User> _userManager, SignInManager<User> _signInManager, IJwtTokenProvider _jwtTokenProvider) : Controller
{
    [HttpGet("GetFarmInfo")]
    public async Task<IActionResult> GetUserFarmInfo()
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return Unauthorized();
        }

        var result = UserFarmInfoResponse.FromUser(user);
        return Json(result, new JsonSerializerOptions()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
        });
    }
    
    [HttpPost("UpdateFarmInfo")]
    public async Task<IActionResult> UpdateUserFarmInfo([FromBody] UserFarmInfoRequest request)
    {
        var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return Unauthorized();
        }

        user.LubricationCostsPercentage = request.LubricationCostsPercentage;
        user.DefaultWage = request.DefaultWage;
        user.OtherExpensesPercentage = request.OtherExpensesPercentage;
        user.FuelCostPerLiter = request.FuelCostPerLiter;
        user.FarmName = request.FarmName;
        
        await _userManager.UpdateAsync(user);
        return Ok();
    }
    
    
    
    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return Unauthorized("Invalid credentials");
        }
        
        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
        {
            return Unauthorized("Invalid credentials");
        }

        var newToken = _jwtTokenProvider.GenerateJwtToken(user);

        return Ok(new LoginResponse()
        {
            Token = newToken.token,
            BearerToken = $"Bearer {newToken.token}",
            Expiration = newToken.validTo
        });
    }
    
    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var existing = await _userManager.FindByEmailAsync(request.Email);
        if (existing is not null)
        {
            return ValidationProblem(Utils.ToValidationProblem("USER_ALREADY_EXISTS", "User with this email already exists"));
        }
        
        var user = new User
        {
            UserName = request.Email, 
            Email = request.Email, 
            Equipment = new List<UserEquipment>(),
            DefaultWage = 15.0f,
            OtherExpensesPercentage = 1.0f,
            LubricationCostsPercentage = 15.0f,
            FuelCostPerLiter = 0.8f,
        };
        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errorDict = result.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());

            return ValidationProblem(Utils.ToValidationProblem(errorDict));
        }

        return Created();
    }
}