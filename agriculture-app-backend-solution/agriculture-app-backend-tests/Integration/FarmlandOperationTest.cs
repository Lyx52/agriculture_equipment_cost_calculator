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
public class FarmlandOperationTest
{
    private WebApplicationFactory<Program> _factory = null!;
    private HttpClient _client = null!;
    private string _token = string.Empty;
    private string _farmlandId = Guid.NewGuid().ToString(); 
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
        // First, add a farmland.
        var addRequest = new UserFarmlandRequest
        {
            Id = _farmlandId,
            ProductCode = "crop_141",
            Area = 200
        };

        var addResponse = await _client.PostAsJsonAsync("/UserFarmland/Add", addRequest, _jsonOptions);
        Assert.IsTrue(addResponse.IsSuccessStatusCode, "Add request should be successful");
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        _client.Dispose();
        _factory.Dispose();
    }
    
       [Test]
        public async Task AddFarmlandOperation_AddsOperation_And_IsRetrievable()
        {
            // Prepare a request to add a farmland operation.
            var addRequest = new FarmlandOperationRequest
            {
                OperationCode = "operation_100",
            };

            // Call the Add endpoint.
            var addResponse = await _client.PostAsJsonAsync($"/FarmlandOperation/{_farmlandId}/Add", addRequest, _jsonOptions);
            Assert.IsTrue(addResponse.IsSuccessStatusCode, "Add request should be successful");

            // Retrieve operations for this farmland.
            var getResponse = await _client.GetAsync($"/FarmlandOperation/{_farmlandId}/GetAll?AddCodifiers=false");
            Assert.IsTrue(getResponse.IsSuccessStatusCode, "GET request should be successful");

            var operations = await getResponse.Content.ReadFromJsonAsync<List<FarmlandOperation>>(_jsonOptions);
            Assert.NotNull(operations);
            Assert.IsNotEmpty(operations, "Expected at least one operation after add");

            // Verify that one operation has the expected values.
            var addedOperation = operations!.FirstOrDefault(o => o.OperationCode == addRequest.OperationCode);
            Assert.NotNull(addedOperation, "The added operation should be found");
        }

        [Test]
        public async Task UpdateFarmlandOperation_UpdatesOperationSuccessfully()
        {
            // First, add an operation.
            var addRequest = new FarmlandOperationRequest
            {
                OperationCode = "operation_110"
            };

            var addResponse = await _client.PostAsJsonAsync($"/FarmlandOperation/{_farmlandId}/Add", addRequest, _jsonOptions);
            Assert.IsTrue(addResponse.IsSuccessStatusCode, "Add request should be successful");

            // Retrieve the added operation to get its ID.
            var getResponse = await _client.GetAsync($"/FarmlandOperation/{_farmlandId}/GetAll?AddCodifiers=false");
            var operations = await getResponse.Content.ReadFromJsonAsync<List<FarmlandOperation>>(_jsonOptions);
            Assert.NotNull(operations);
            var operation = operations!.FirstOrDefault(o => o.MachineId == addRequest.MachineId &&
                                                              o.OperationCode == addRequest.OperationCode);
            Assert.NotNull(operation, "Operation should be found after add");
            var operationId = operation!.Id;

            // Prepare an update request with new values.
            var updateRequest = new FarmlandOperationRequest
            {
                OperationCode = "operation_115"
            };

            // Call the Update endpoint.
            var updateResponse = await _client.PostAsJsonAsync($"/FarmlandOperation/{_farmlandId}/Update/{operationId}", updateRequest, _jsonOptions);
            Assert.IsTrue(updateResponse.IsSuccessStatusCode, "Update request should be successful");

            // Retrieve the operations again and verify the update.
            var getAfterResponse = await _client.GetAsync($"/FarmlandOperation/{_farmlandId}/GetAll?AddCodifiers=false");
            var operationsAfter = await getAfterResponse.Content.ReadFromJsonAsync<List<FarmlandOperation>>(_jsonOptions);
            Assert.NotNull(operationsAfter);
            var updatedOperation = operationsAfter!.FirstOrDefault(o => o.Id == operationId);
            Assert.NotNull(updatedOperation);
            Assert.AreEqual(updateRequest.OperationCode, updatedOperation.OperationCode);
        }

        [Test]
        public async Task RemoveFarmlandOperation_RemovesOperationSuccessfully()
        {
            // First, add an operation.
            var addRequest = new FarmlandOperationRequest
            {
                OperationCode = "operation_120",
            };

            var addResponse = await _client.PostAsJsonAsync($"/FarmlandOperation/{_farmlandId}/Add", addRequest, _jsonOptions);
            Assert.IsTrue(addResponse.IsSuccessStatusCode, "Add request should be successful");

            // Retrieve the operation to get its ID.
            var getResponse = await _client.GetAsync($"/FarmlandOperation/{_farmlandId}/GetAll?AddCodifiers=false");
            var operations = await getResponse.Content.ReadFromJsonAsync<List<FarmlandOperation>>(_jsonOptions);
            Assert.NotNull(operations);
            var operation = operations!.FirstOrDefault(o => o.OperationCode == addRequest.OperationCode);
            Assert.NotNull(operation, "Operation should exist before removal");
            var operationId = operation!.Id;

            // Call the Remove endpoint.
            var deleteResponse = await _client.DeleteAsync($"/FarmlandOperation/{_farmlandId}/Remove/{operationId}");
            Assert.IsTrue(deleteResponse.IsSuccessStatusCode, "Delete request should be successful");

            // Verify that the operation is no longer present.
            var getAfterResponse = await _client.GetAsync($"/FarmlandOperation/{_farmlandId}/GetAll?AddCodifiers=false");
            var operationsAfter = await getAfterResponse.Content.ReadFromJsonAsync<List<FarmlandOperation>>(_jsonOptions);
            Assert.NotNull(operationsAfter);
            var removedOperation = operationsAfter!.FirstOrDefault(o => o.Id == operationId);
            Assert.IsNull(removedOperation, "The operation should have been removed");
        }
}

