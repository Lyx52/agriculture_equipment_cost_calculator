using Microsoft.AspNetCore.Mvc;

namespace AgricultureAppBackend.Infrastructure.Constants;

public class Utils
{
    public static ValidationProblemDetails ToValidationProblem(string errorKey, string error)
    {
        return ToValidationProblem(new Dictionary<string, string[]>()
        {
            { errorKey, [error] }
        });
    }

    public static ValidationProblemDetails ToValidationProblem(Dictionary<string, string[]> errors)
    {
        return new ValidationProblemDetails(errors)
        {
            Type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
            Title = "One or more validation errors occurred.",
            Status = StatusCodes.Status400BadRequest
        };
    }
}