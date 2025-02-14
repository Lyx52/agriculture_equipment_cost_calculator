using AgricultureAppBackend;
using AgricultureAppBackend.Infrastructure.Database.Model;
using AgricultureAppBackend.Infrastructure.Models;
using AgricultureAppBackend.Infrastructure.Models.Request;
using AgricultureAppBackend.Infrastructure.Models.Response;

namespace AgricultureAppBackendTests.Integration;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using NUnit.Framework;

[TestFixture]
public class UserFarmlandTest
{
    private WebApplicationFactory<Program> _factory = null!;
    private HttpClient _client = null!;
    private string _token = string.Empty;
    // Define JSON options to match your controller’s snake_case settings if needed.
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseUpper
    };

    [OneTimeSetUp]
    public async Task OneTimeSetUpAsync()
    {
        // Set environment to "Test" so that your Program.cs registers an in-memory (or test-specific) DB.
        Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Test");

        _factory = new WebApplicationFactory<Program>();
        _client = _factory.CreateClient();

        var registerPayload = new RegisterRequest()
        { 
            Email = "test@test.c", 
            Password = "Password0$" 
        };

        var registerResponse = await _client.PostAsJsonAsync("/Auth/Register", registerPayload, _jsonOptions);

        Assert.IsTrue(registerResponse.IsSuccessStatusCode, "Login should be successful");
        
        var loginPayload = new LoginRequest()
        { 
            Email = "test@test.c", 
            Password = "Password0$" 
        };

        var loginResponse = await _client.PostAsJsonAsync("/Auth/Login", loginPayload, _jsonOptions);
        
        var loginContent = await loginResponse.Content.ReadFromJsonAsync<LoginResponse>(_jsonOptions);
        Assert.NotNull(loginContent, "Login response should be deserializable");
        _token = loginContent!.Token;
        Assert.IsNotEmpty(_token, "Token should not be empty");

        // Add the token to the HttpClient for subsequent requests.
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        _client.Dispose();
        _factory.Dispose();
    }
    
    [Test]
    public async Task AddUserFarmland_ReturnsCreated_And_FarmlandIsRetrievable()
    {
        // Arrange: prepare a farmland request.
        var addRequest = new UserFarmlandRequest
        {
            ProductCode = "crop_151",
            Area = 150.5
        };

        // Act: call the Add endpoint.
        var addResponse = await _client.PostAsJsonAsync("/UserFarmland/Add", addRequest, _jsonOptions);
        Assert.IsTrue(addResponse.IsSuccessStatusCode, "Add request should be successful");

        // Retrieve farmlands to verify that the new farmland appears.
        var getResponse = await _client.GetAsync("/UserFarmland/Get?AddOperations=false&AddCodifiers=false");
        Assert.IsTrue(getResponse.IsSuccessStatusCode, "GET request should be successful");

        var farmlands = await getResponse.Content.ReadFromJsonAsync<List<UserFarmland>>(_jsonOptions);
        Assert.NotNull(farmlands);
        var added = farmlands!.FirstOrDefault(f => f.ProductCode == addRequest.ProductCode);
        Assert.NotNull(added, "Added farmland should be retrievable");
    }

    [Test]
    public async Task UpdateUserFarmland_UpdatesDataSuccessfully()
    {
        // First, add a farmland.
        var addRequest = new UserFarmlandRequest
        {
            ProductCode = "crop_141",
            Area = 200
        };

        var addResponse = await _client.PostAsJsonAsync("/UserFarmland/Add", addRequest, _jsonOptions);
        Assert.IsTrue(addResponse.IsSuccessStatusCode, "Add request should be successful");

        // Retrieve farmlands to obtain the farmland id.
        var getResponse = await _client.GetAsync("/UserFarmland/Get?AddOperations=false&AddCodifiers=false");
        var farmlands = await getResponse.Content.ReadFromJsonAsync<List<UserFarmland>>(_jsonOptions);
        Assert.NotNull(farmlands);
        var farmland = farmlands!.FirstOrDefault(f => f.ProductCode == addRequest.ProductCode);
        Assert.NotNull(farmland, "Farmland should exist after add");
        var farmlandId = farmland!.Id;

        // Prepare update request with new values.
        var updateRequest = new UserFarmlandRequest
        {
            ProductCode = "crop_140",
            Area = 250
        };

        // Act: call the Update endpoint.
        var updateResponse = await _client.PostAsJsonAsync($"/UserFarmland/Update/{farmlandId}", updateRequest, _jsonOptions);
        Assert.IsTrue(updateResponse.IsSuccessStatusCode, "Update request should be successful");

        // Verify that the farmland data was updated.
        var getAfterResponse = await _client.GetAsync("/UserFarmland/Get?AddOperations=false&AddCodifiers=false");
        var farmlandsAfter = await getAfterResponse.Content.ReadFromJsonAsync<List<UserFarmland>>(_jsonOptions);
        Assert.NotNull(farmlandsAfter);
        var updated = farmlandsAfter!.FirstOrDefault(f => f.Id == farmlandId);
        Assert.NotNull(updated, "Updated farmland should be present");
        Assert.AreEqual(updateRequest.ProductCode, updated!.ProductCode);
        Assert.AreEqual(updateRequest.Area, updated.Area);
    }

    [Test]
    public async Task RemoveUserFarmland_RemovesFarmlandSuccessfully()
    {
        // First, add a farmland to remove.
        var addRequest = new UserFarmlandRequest
        {
            ProductCode = "crop_150",
            Area = 300
        };

        var addResponse = await _client.PostAsJsonAsync("/UserFarmland/Add", addRequest, _jsonOptions);
        Assert.IsTrue(addResponse.IsSuccessStatusCode, "Add request should be successful");

        // Retrieve the farmland id.
        var getResponse = await _client.GetAsync("/UserFarmland/Get?AddOperations=false&AddCodifiers=false");
        var farmlands = await getResponse.Content.ReadFromJsonAsync<List<UserFarmland>>(_jsonOptions);
        Assert.NotNull(farmlands);
        var farmland = farmlands!.FirstOrDefault(f => f.ProductCode == addRequest.ProductCode);
        Assert.NotNull(farmland, "Farmland should exist before removal");
        var farmlandId = farmland!.Id;

        // Act: call the Remove endpoint.
        var deleteResponse = await _client.DeleteAsync($"/UserFarmland/Remove/{farmlandId}");
        Assert.IsTrue(deleteResponse.IsSuccessStatusCode, "Delete request should be successful");

        // Verify removal.
        var getAfterResponse = await _client.GetAsync("/UserFarmland/Get?AddOperations=false&AddCodifiers=false");
        var farmlandsAfter = await getAfterResponse.Content.ReadFromJsonAsync<List<UserFarmland>>(_jsonOptions);
        Assert.NotNull(farmlandsAfter);
        var removed = farmlandsAfter!.FirstOrDefault(f => f.Id == farmlandId);
        Assert.IsNull(removed, "Farmland should no longer exist after removal");
    }
}

