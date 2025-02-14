using AgricultureAppBackend;
using AgricultureAppBackend.Infrastructure.Database.Model;
using AgricultureAppBackend.Infrastructure.Models.Json;
using AgricultureAppBackend.Infrastructure.Models.Request;
using AgricultureAppBackend.Infrastructure.Models.Response;

namespace AgricultureAppBackendTests.Integration;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using NUnit.Framework;

[TestFixture]
public class UserEquipmentTest
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
    public async Task AddUserEquipment_ReturnsCreated_And_EquipmentIsRetrievable()
    {
        var addRequest = new UserEquipmentRequest
        {
            Manufacturer = "TestManufacturer",
            EquipmentTypeCode = "Type123",
            Model = "ModelX",
            Specifications = new EquipmentSpecification(),
            Price = 1000
        };

        var addResponse = await _client.PostAsJsonAsync("/UserEquipment/Add", addRequest, _jsonOptions);
        Assert.IsTrue(addResponse.IsSuccessStatusCode, "addResponse.IsSuccessStatusCode");

        var getResponse = await _client.GetAsync("/UserEquipment/Get");
        Assert.IsTrue(getResponse.IsSuccessStatusCode, "getResponse.IsSuccessStatusCode");
        
        var equipmentList = await getResponse.Content.ReadFromJsonAsync<List<UserEquipment>>(_jsonOptions);
        Assert.NotNull(equipmentList);
        Assert.IsNotEmpty(equipmentList!);

        var addedEquipment = equipmentList!.FirstOrDefault(e =>
            e.Manufacturer == addRequest.Manufacturer &&
            e.EquipmentTypeCode == addRequest.EquipmentTypeCode &&
            e.Model == addRequest.Model);
        Assert.NotNull(addedEquipment);
    }

    [Test]
    public async Task UpdateUserEquipment_ReturnsOk_And_UpdatesEquipment()
    {
        var addRequest = new UserEquipmentRequest
        {
            Manufacturer = "OriginalManufacturer",
            EquipmentTypeCode = "TypeA",
            Model = "ModelOriginal",
            Specifications = new EquipmentSpecification(),
            Price = 500
        };

        var addResponse = await _client.PostAsJsonAsync("/UserEquipment/Add", addRequest, _jsonOptions);
        Assert.IsTrue(addResponse.IsSuccessStatusCode, "addResponse.IsSuccessStatusCode");

        var getResponse = await _client.GetAsync("/UserEquipment/Get");
        var equipmentList = await getResponse.Content.ReadFromJsonAsync<List<UserEquipment>>(_jsonOptions);
        Assert.NotNull(equipmentList);
        var equipmentToUpdate = equipmentList!.FirstOrDefault(e =>
            e.Manufacturer == addRequest.Manufacturer &&
            e.Model == addRequest.Model);
        Assert.NotNull(equipmentToUpdate);
        var equipmentId = equipmentToUpdate!.Id;

        var updateRequest = new UserEquipmentRequest
        {
            Manufacturer = "UpdatedManufacturer",
            EquipmentTypeCode = "TypeB",
            Model = "ModelUpdated",
            Specifications = new EquipmentSpecification(),
            Price = 750
        };

        var updateResponse = await _client.PostAsJsonAsync($"/UserEquipment/Update/{equipmentId}", updateRequest, _jsonOptions);
        Assert.IsTrue(updateResponse.IsSuccessStatusCode, "updateResponse.IsSuccessStatusCode");

        var getResponseAfter = await _client.GetAsync("/UserEquipment/Get");
        var equipmentListAfter = await getResponseAfter.Content.ReadFromJsonAsync<List<UserEquipment>>(_jsonOptions);
        Assert.NotNull(equipmentListAfter);
        var updatedEquipment = equipmentListAfter!.FirstOrDefault(e => e.Id == equipmentId);
        Assert.NotNull(updatedEquipment);
        Assert.That(updatedEquipment!.Manufacturer, Is.EqualTo(updateRequest.Manufacturer));
        Assert.That(updatedEquipment.EquipmentTypeCode, Is.EqualTo(updateRequest.EquipmentTypeCode));
        Assert.That(updatedEquipment.Model, Is.EqualTo(updateRequest.Model));
        Assert.That(updatedEquipment.Price, Is.EqualTo(updateRequest.Price));
    }

    [Test]
    public async Task RemoveUserEquipment_ReturnsOk_And_EquipmentIsRemoved()
    {
        var addRequest = new UserEquipmentRequest()
        {
            Manufacturer = "ToRemove",
            EquipmentTypeCode = "RemoveType",
            Model = "ModelRemove",
            Specifications = new EquipmentSpecification(),
            Price = 300
        };

        var addResponse = await _client.PostAsJsonAsync("/UserEquipment/Add", addRequest, _jsonOptions);
        Assert.IsTrue(addResponse.IsSuccessStatusCode, "addResponse.IsSuccessStatusCode");

        // Retrieve the equipment to get its ID.
        var getResponse = await _client.GetAsync("/UserEquipment/Get");
        var equipmentList = await getResponse.Content.ReadFromJsonAsync<List<UserEquipment>>(_jsonOptions);
        Assert.NotNull(equipmentList);
        var equipmentToRemove = equipmentList!.FirstOrDefault(e =>
            e.Manufacturer == addRequest.Manufacturer &&
            e.Model == addRequest.Model);
        Assert.NotNull(equipmentToRemove);
        var equipmentId = equipmentToRemove!.Id;

        // Act: call DELETE /UserEquipment/Remove/{equipmentId}
        var deleteResponse = await _client.DeleteAsync($"/UserEquipment/Remove/{equipmentId}");
        Assert.IsTrue(deleteResponse.IsSuccessStatusCode, "deleteResponse.IsSuccessStatusCode");

        // Verify that the equipment is removed.
        var getAfterResponse = await _client.GetAsync("/UserEquipment/Get");
        var equipmentListAfter = await getAfterResponse.Content.ReadFromJsonAsync<List<UserEquipment>>(_jsonOptions);
        Assert.NotNull(equipmentListAfter);
        var removedEquipment = equipmentListAfter!.FirstOrDefault(e => e.Id == equipmentId);
        Assert.IsNull(removedEquipment);
    }
}

