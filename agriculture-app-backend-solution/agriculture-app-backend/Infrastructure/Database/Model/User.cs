using Microsoft.AspNetCore.Identity;

namespace AgricultureAppBackend.Infrastructure.Database.Model;

public class User : IdentityUser
{
    public List<UserEquipment> Equipment { get; set; } = new List<UserEquipment>();
    public List<UserFarmland> Farmlands { get; set; } = new List<UserFarmland>();
}