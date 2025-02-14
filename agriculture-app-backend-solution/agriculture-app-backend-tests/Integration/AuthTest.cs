using AgricultureAppBackend;
using AgricultureAppBackend.Infrastructure.Models.Request;
using AgricultureAppBackend.Infrastructure.Models.Response;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace AgricultureAppBackendTests.Integration;

using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using NUnit.Framework;

[TestFixture]
public class AuthIntegrationTests
{
    private WebApplicationFactory<Program> _factory = null!;
    private HttpClient _client = null!;

    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Test");
        _factory = new WebApplicationFactory<Program>();
        _client = _factory.CreateClient();
    }

    [Test]
    public async Task RegisterAndLogin_ReturnsExpectedResults()
    {
        var registerPayload = new RegisterRequest()
        { 
            Email = "test@test.c", 
            Password = "Password0$" 
        };

        var registerResponse = await _client.PostAsJsonAsync("/Auth/Register", registerPayload);

        Assert.IsTrue(registerResponse.IsSuccessStatusCode, "Login should be successful");
        
        var loginPayload = new LoginRequest()
        { 
            Email = "test@test.c", 
            Password = "Password0$" 
        };

        var loginResponse = await _client.PostAsJsonAsync("/Auth/Login", loginPayload);

        Assert.IsTrue(loginResponse.IsSuccessStatusCode, "Login should be successful");

        var loginContent = await loginResponse.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(loginContent, "Login response should be deserializable");
        Assert.IsFalse(string.IsNullOrEmpty(loginContent!.Token), "Token should not be empty");
    }
    
    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        _client.Dispose();
        _factory.Dispose();
    }
}