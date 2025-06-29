using System.ComponentModel.DataAnnotations;

namespace AgricultureAppBackend.Infrastructure.Models.Request;

public class FarmlandOperationRequest
{
    public string? TractorOrCombineId { get; set; }
    public string? MachineId { get; set; }
    public string? OperationCode { get; set; }
    public string? EmployeeOrExternalServiceId { get; set; }
}