using Microsoft.AspNetCore.Identity;

namespace AgricultureAppBackend.Infrastructure.Data.Model;

public class User : IdentityUser
{
    public List<Equipment> Equipment { get; set; } = new List<Equipment>();
}