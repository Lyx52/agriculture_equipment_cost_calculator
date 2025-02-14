using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AgricultureAppBackend.Infrastructure.Database.Model;
using AgricultureAppBackend.Infrastructure.Models.Request;
using AgricultureAppBackend.Infrastructure.Models.Response;
using AgricultureAppBackend.Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
namespace AgricultureAppBackend.Controllers;

[ApiController]
[Route("Auth")]
public class AuthController(UserManager<User> _userManager, SignInManager<User> _signInManager, IJwtTokenProvider _jwtTokenProvider) : Controller
{
    [HttpPost("Login")]
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        {
            return BadRequest("Password and Email are required");
        }
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
    [EnableCors("DefaultCorsPolicy")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        {
            return BadRequest("Password and Email are required");
        }

        var existing = await _userManager.FindByEmailAsync(request.Email);
        if (existing is not null)
        {
            return BadRequest("User with this email already exists");
        }
        
        var user = new User
        {
            UserName = request.Email, 
            Email = request.Email, 
            Equipment = new List<UserEquipment>() 
        };
        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Created();
    }
}