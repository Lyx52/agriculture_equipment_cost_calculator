namespace AgricultureAppBackend.Infrastructure.Settings;

public sealed class ApplicationSettings
{
    public string DbUsername { get; set; }
    
    public string DbPassword { get; set; }
    public string DbName { get; set; }
    public string DbHostname { get; set; }
    public string CorsSettings { get; set; }
    public string JwtKey { get; set; }
    public string JwtIssuer { get; set; }
    public string JwtAudience { get; set; }
}