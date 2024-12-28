namespace agriculture_app_backend.Infrastructure.Settings;

public sealed class ApplicationSettings
{
    public string DbUsername { get; set; }
    
    public string DbPassword { get; set; }
    
    public string DbName { get; set; }
    
    public string DbHostname { get; set; }
    public string CorsSettings { get; set; }
}