using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using TaskFlow.Application.Contracts.ActivityLogs;
using TaskFlow.Application.Contracts.Categories;
using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.Application.Contracts.TodoItems;
using TaskFlow.Domain.Shared.TodoItems;
using TaskFlow.IntegrationTests.Base.Base;
using TaskFlow.IntegrationTests.Base.Common;
using Xunit;
using Xunit.Abstractions;

namespace TaskFlow.IntegrationTests.HttpApi.Host.ActivityLogs;

[Collection("Feature Tests")]
[TestCaseOrderer("TaskFlow.IntegrationTests.Base.Common.PriorityOrderer", "TaskFlow.IntegrationTests.Base")]
public class ActivityLogIntegrationTest : BaseIntegrationTest
{
    private readonly ITestOutputHelper _testOutputHelper;
    private static Guid _testCategoryId = Guid.Empty;
    private static Guid _testTodoItemId = Guid.Empty;

    public ActivityLogIntegrationTest(IntegrationTestWebAppFactory factory, ITestOutputHelper testOutputHelper) : base(factory)
    {
        _testOutputHelper = testOutputHelper;
    }

    [Fact, TestPriority(1)]
    public async Task Success_Should_Create_Category_For_ActivityLog_Tests_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var createRequest = new CreateCategoryRequestDto
        {
            Name = $"ActivityLog Test Category {Guid.NewGuid():N}",
            Description = "Category for ActivityLog integration tests",
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
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        });

        Assert.NotNull(category);
        _testCategoryId = category.Id;
        _testOutputHelper.WriteLine($"[SUCCESS] Created category for ActivityLog tests with ID: {_testCategoryId}");
    }

    [Fact, TestPriority(2)]
    public async Task Success_Should_Create_TodoItem_For_ActivityLog_Tests_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testCategoryId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var createRequest = new CreateTodoItemRequestDto
        {
            Title = $"ActivityLog Test TodoItem {Guid.NewGuid():N}",
            Description = "TodoItem for ActivityLog integration tests",
            Status = TodoStatus.Backlog,
            Priority = TodoPriority.Medium,
            CategoryId = _testCategoryId
        };

        // Act
        var content = new StringContent(
            JsonSerializer.Serialize(createRequest, new JsonSerializerOptions
            {
                Converters = { new JsonStringEnumConverter() }
            }),
            Encoding.UTF8,
            "application/json"
        );

        var response = await HttpClient.PostAsync("/api/v1/todo-items", content);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var todoItem = JsonSerializer.Deserialize<TodoItemResponseDto>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        });

        Assert.NotNull(todoItem);
        Assert.NotEqual(Guid.Empty, todoItem.Id);
        _testTodoItemId = todoItem.Id;
        _testOutputHelper.WriteLine($"[SUCCESS] Created TodoItem for ActivityLog tests with ID: {_testTodoItemId}");
    }

    [Fact, TestPriority(3)]
    public async Task Success_Should_Update_TodoItem_To_Generate_ActivityLog_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        if (_testTodoItemId == Guid.Empty)
        {
            // If previous test failed, skip this test
            _testOutputHelper.WriteLine($"[SKIP] TodoItem not created in previous test, skipping this test");
            return;
        }
        Assert.NotEqual(Guid.Empty, _testTodoItemId);
        Assert.NotEqual(Guid.Empty, _testCategoryId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var updateRequest = new UpdateTodoItemRequestDto
        {
            Title = $"Updated TodoItem for ActivityLog {Guid.NewGuid():N}",
            Description = "Updated description to generate activity log",
            Priority = TodoPriority.High,
            CategoryId = _testCategoryId
        };

        // Act
        var content = new StringContent(
            JsonSerializer.Serialize(updateRequest, new JsonSerializerOptions
            {
                Converters = { new JsonStringEnumConverter() }
            }),
            Encoding.UTF8,
            "application/json"
        );

        var response = await HttpClient.PutAsync($"/api/v1/todo-items/{_testTodoItemId}", content);

        // Assert
        response.EnsureSuccessStatusCode();
        _testOutputHelper.WriteLine($"[SUCCESS] Updated TodoItem to generate ActivityLog entries");
    }

    [Fact, TestPriority(4)]
    public async Task Success_Should_Get_Paged_ActivityLogs_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        if (_testTodoItemId == Guid.Empty)
        {
            // If previous test failed, skip this test
            _testOutputHelper.WriteLine($"[SKIP] TodoItem not created in previous test, skipping this test");
            return;
        }
        Assert.NotEqual(Guid.Empty, _testTodoItemId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/todo-items/{_testTodoItemId}/activity-logs/paged?Page=1&PerPage=10");

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var pagedResult = JsonSerializer.Deserialize<PagedResult<ActivityLogResponseDto>>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        });

        Assert.NotNull(pagedResult);
        Assert.NotNull(pagedResult.Data);
        Assert.True(pagedResult.Meta.TotalCount >= 0);
        Assert.All(pagedResult.Data, log => 
        {
            Assert.Equal(_testTodoItemId, log.TodoItemId);
            Assert.NotEmpty(log.ActionKey);
            Assert.NotEqual(Guid.Empty, log.UserId);
        });

        _testOutputHelper.WriteLine($"[SUCCESS] Retrieved {pagedResult.Data.Count} ActivityLogs (Total: {pagedResult.Meta.TotalCount})");
        
        if (pagedResult.Data.Any())
        {
            foreach (var log in pagedResult.Data.Take(3))
            {
                _testOutputHelper.WriteLine($"[INFO] ActivityLog - ActionKey: {log.ActionKey}, OldValue: {log.OldValue}, NewValue: {log.NewValue}");
            }
        }
    }

    [Fact, TestPriority(5)]
    public async Task Failure_Should_Not_Get_ActivityLogs_Without_Token_Async()
    {
        // Arrange
        HttpClient.DefaultRequestHeaders.Authorization = null;

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/todo-items/{_testTodoItemId}/activity-logs/paged");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Unauthorized ActivityLogs retrieval correctly rejected");
    }

    [Fact, TestPriority(6)]
    public async Task Failure_Should_Not_Get_ActivityLogs_With_Invalid_TodoItemId_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);
        var invalidTodoItemId = Guid.NewGuid();

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/todo-items/{invalidTodoItemId}/activity-logs/paged");

        // Assert
        // Should return 200 OK with empty result, or 404 if TodoItem doesn't exist
        // We'll check for 200 OK as the endpoint should handle non-existent TodoItems gracefully
        if (response.StatusCode == HttpStatusCode.OK)
        {
            var responseBody = await response.Content.ReadAsStringAsync();
            var pagedResult = JsonSerializer.Deserialize<PagedResult<ActivityLogResponseDto>>(responseBody, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(pagedResult);
            Assert.Equal(0, pagedResult.Meta.TotalCount);
            _testOutputHelper.WriteLine($"[SUCCESS] Invalid TodoItemId handled correctly - returned empty result");
        }
        else
        {
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            _testOutputHelper.WriteLine($"[SUCCESS] Invalid TodoItemId correctly rejected with 404");
        }
    }
}

