namespace AgricultureAppBackend.Infrastructure.Models.Response;

public class LoginResponse
{
    public string Token { get; set; }
    public string BearerToken { get; set; }
    public DateTime Expiration { get; set; }
}