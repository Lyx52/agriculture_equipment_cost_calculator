using System.ComponentModel.DataAnnotations;

namespace AgricultureAppBackend.Infrastructure.Models.Request;

public class RegisterRequest
{
    [Required]
    public string Password { get; set; }
    [Required]
    public string Email { get; set; }
}