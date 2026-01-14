using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using TaskFlow.Application.Contracts.Categories;
using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.IntegrationTests.Base.Base;
using TaskFlow.IntegrationTests.Base.Common;
using Xunit;
using Xunit.Abstractions;

namespace TaskFlow.IntegrationTests.HttpApi.Host.Categories;

[Collection("Feature Tests")]
[TestCaseOrderer("TaskFlow.IntegrationTests.Base.Common.PriorityOrderer", "TaskFlow.IntegrationTests.Base")]
public class CategoryIntegrationTest : BaseIntegrationTest
{
    private readonly ITestOutputHelper _testOutputHelper;
    private static Guid _testCategoryId = Guid.Empty;

    public CategoryIntegrationTest(IntegrationTestWebAppFactory factory, ITestOutputHelper testOutputHelper) : base(factory)
    {
        _testOutputHelper = testOutputHelper;
    }

    [Fact, TestPriority(1)]
    public async Task Success_Should_Create_Category_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var createRequest = new CreateCategoryRequestDto
        {
            Name = $"Test Category {Guid.NewGuid():N}",
            Description = "Test category description",
            ColorHex = "#FF5733"
        };

        // Act
        var content = new StringContent(
            JsonSerializer.Serialize(createRequest),
            Encoding.UTF8,
            "application/json"
        );

        var response = await HttpClient.PostAsync("/api/v1/categories", content);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var category = JsonSerializer.Deserialize<CategoryResponseDto>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(category);
        Assert.NotEqual(Guid.Empty, category.Id);
        Assert.Equal(createRequest.Name, category.Name);
        Assert.Equal(createRequest.Description, category.Description);
        Assert.Equal(createRequest.ColorHex, category.ColorHex);

        _testCategoryId = category.Id;
        _testOutputHelper.WriteLine($"[SUCCESS] Created category with ID: {_testCategoryId}");
    }

    [Fact, TestPriority(2)]
    public async Task Success_Should_Get_Category_By_Id_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testCategoryId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/categories/{_testCategoryId}");

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var category = JsonSerializer.Deserialize<CategoryResponseDto>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(category);
        Assert.Equal(_testCategoryId, category.Id);
        Assert.NotEmpty(category.Name);

        _testOutputHelper.WriteLine($"[SUCCESS] Retrieved category with ID: {category.Id}, Name: {category.Name}");
    }

    [Fact, TestPriority(3)]
    public async Task Success_Should_Get_Paged_Categories_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        // Act
        var response = await HttpClient.GetAsync("/api/v1/categories/paged?Page=1&PerPage=10");

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var pagedResult = JsonSerializer.Deserialize<PagedResult<CategoryResponseDto>>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(pagedResult);
        Assert.NotNull(pagedResult.Data);
        Assert.True(pagedResult.Meta.TotalCount >= 0);
        Assert.True(pagedResult.Data.Count <= 10);

        _testOutputHelper.WriteLine($"[SUCCESS] Retrieved {pagedResult.Data.Count} categories (Total: {pagedResult.Meta.TotalCount})");
    }

    [Fact, TestPriority(4)]
    public async Task Success_Should_Update_Category_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testCategoryId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var updateRequest = new UpdateCategoryRequestDto
        {
            Name = $"Updated Category {Guid.NewGuid():N}",
            Description = "Updated category description",
            ColorHex = "#33FF57"
        };

        // Act
        var content = new StringContent(
            JsonSerializer.Serialize(updateRequest),
            Encoding.UTF8,
            "application/json"
        );

        var response = await HttpClient.PutAsync($"/api/v1/categories/{_testCategoryId}", content);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var category = JsonSerializer.Deserialize<CategoryResponseDto>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(category);
        Assert.Equal(_testCategoryId, category.Id);
        Assert.Equal(updateRequest.Name, category.Name);
        Assert.Equal(updateRequest.Description, category.Description);
        Assert.Equal(updateRequest.ColorHex, category.ColorHex);

        _testOutputHelper.WriteLine($"[SUCCESS] Updated category with ID: {category.Id}");
    }

    [Fact, TestPriority(5)]
    public async Task Failure_Should_Not_Get_Category_With_Invalid_Id_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);
        var invalidId = Guid.NewGuid();

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/categories/{invalidId}");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Invalid category ID correctly rejected");
    }

    [Fact, TestPriority(6)]
    public async Task Failure_Should_Not_Create_Category_Without_Token_Async()
    {
        // Arrange
        HttpClient.DefaultRequestHeaders.Authorization = null;

        var createRequest = new CreateCategoryRequestDto
        {
            Name = "Test Category",
            Description = "Test description"
        };

        // Act
        var content = new StringContent(
            JsonSerializer.Serialize(createRequest),
            Encoding.UTF8,
            "application/json"
        );

        var response = await HttpClient.PostAsync("/api/v1/categories", content);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Unauthorized category creation correctly rejected");
    }

    [Fact, TestPriority(7)]
    public async Task Failure_Should_Not_Delete_Category_Without_Token_Async()
    {
        // Arrange
        HttpClient.DefaultRequestHeaders.Authorization = null;

        // Act
        var response = await HttpClient.DeleteAsync($"/api/v1/categories/{_testCategoryId}");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Unauthorized category deletion correctly rejected");
    }

    [Fact, TestPriority(8)]
    public async Task Success_Should_Delete_Category_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testCategoryId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        // Act
        var response = await HttpClient.DeleteAsync($"/api/v1/categories/{_testCategoryId}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Deleted category with ID: {_testCategoryId}");
    }

    [Fact, TestPriority(9)]
    public async Task Failure_Should_Not_Delete_Non_Existent_Category_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);
        var nonExistentId = Guid.NewGuid();

        // Act
        var response = await HttpClient.DeleteAsync($"/api/v1/categories/{nonExistentId}");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Non-existent category deletion correctly rejected");
    }
}

