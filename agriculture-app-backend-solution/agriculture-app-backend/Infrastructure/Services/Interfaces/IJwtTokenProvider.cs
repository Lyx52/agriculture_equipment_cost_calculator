using AgricultureAppBackend.Infrastructure.Database.Model;

namespace AgricultureAppBackend.Infrastructure.Services.Interfaces;

public interface IJwtTokenProvider
{
    (string token, DateTime validTo) GenerateJwtToken(User user);
}