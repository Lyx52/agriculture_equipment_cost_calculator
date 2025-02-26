using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AgricultureAppBackend.Infrastructure.Database.Model;
using AgricultureAppBackend.Infrastructure.Services.Interfaces;
using AgricultureAppBackend.Infrastructure.Settings;
using Microsoft.IdentityModel.Tokens;

namespace AgricultureAppBackend.Infrastructure.Services;

public class JwtTokenProvider(ApplicationSettings _settings) : IJwtTokenProvider
{
    public (string token, DateTime validTo) GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_settings.JwtKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email!)
            }),
            Expires = DateTime.UtcNow.AddHours(24),
            Issuer = _settings.JwtIssuer,
            Audience = _settings.JwtAudience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);
        return (tokenString, token.ValidTo);
    }
}