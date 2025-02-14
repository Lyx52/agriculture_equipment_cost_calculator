using Microsoft.AspNetCore.Identity;

namespace AgricultureAppBackend.Infrastructure.Constants;

public static class PasswordRequirementsConfiguration
{
    public static PasswordOptions Default { get; set; } = new PasswordOptions()
    {
        RequireDigit = true,
        RequiredLength = 6,
        RequireLowercase = true,
        RequireUppercase = true,
        RequireNonAlphanumeric = true
    };
}