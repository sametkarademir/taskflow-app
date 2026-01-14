using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using TaskFlow.Application.Contracts.Categories;
using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.Application.Contracts.TodoItems;
using TaskFlow.Domain.Shared.TodoItems;
using TaskFlow.IntegrationTests.Base.Base;
using TaskFlow.IntegrationTests.Base.Common;
using Xunit;
using Xunit.Abstractions;

namespace TaskFlow.IntegrationTests.HttpApi.Host.TodoItems;

[Collection("Feature Tests")]
[TestCaseOrderer("TaskFlow.IntegrationTests.Base.Common.PriorityOrderer", "TaskFlow.IntegrationTests.Base")]
public class TodoItemIntegrationTest : BaseIntegrationTest
{
    private readonly ITestOutputHelper _testOutputHelper;
    private static Guid _testCategoryId = Guid.Empty;
    private static Guid _testTodoItemId = Guid.Empty;
    private static Guid _testCompletedTodoItemId = Guid.Empty;

    public TodoItemIntegrationTest(IntegrationTestWebAppFactory factory, ITestOutputHelper testOutputHelper) : base(factory)
    {
        _testOutputHelper = testOutputHelper;
    }

    [Fact, TestPriority(1)]
    public async Task Success_Should_Create_Category_For_TodoItem_Tests_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var createRequest = new CreateCategoryRequestDto
        {
            Name = $"TodoItem Test Category {Guid.NewGuid():N}",
            Description = "Category for TodoItem integration tests",
            ColorHex = "#FF5733"
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
        _testOutputHelper.WriteLine($"[SUCCESS] Created category for TodoItem tests with ID: {_testCategoryId}");
    }

    [Fact, TestPriority(2)]
    public async Task Success_Should_Create_TodoItem_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testCategoryId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var createRequest = new CreateTodoItemRequestDto
        {
            Title = $"Test TodoItem {Guid.NewGuid():N}",
            Description = "Test TodoItem description",
            Status = TodoStatus.Backlog,
            Priority = TodoPriority.High,
            DueDate = DateTime.UtcNow.AddDays(7),
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
        Assert.Equal(createRequest.Title, todoItem.Title);
        Assert.Equal(createRequest.Description, todoItem.Description);
        Assert.Equal(createRequest.Status, todoItem.Status);
        Assert.Equal(createRequest.Priority, todoItem.Priority);
        Assert.Equal(createRequest.CategoryId, todoItem.CategoryId);
        Assert.False(todoItem.IsArchived);

        _testTodoItemId = todoItem.Id;
        _testOutputHelper.WriteLine($"[SUCCESS] Created TodoItem with ID: {_testTodoItemId}");
    }

    [Fact, TestPriority(3)]
    public async Task Success_Should_Create_Completed_TodoItem_For_Archive_Test_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testCategoryId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var createRequest = new CreateTodoItemRequestDto
        {
            Title = $"Completed TodoItem {Guid.NewGuid():N}",
            Description = "Completed TodoItem for archive test",
            Status = TodoStatus.Completed,
            Priority = TodoPriority.Low,
            DueDate = DateTime.UtcNow.AddDays(-1),
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
        Assert.Equal(TodoStatus.Completed, todoItem.Status);
        _testCompletedTodoItemId = todoItem.Id;
        _testOutputHelper.WriteLine($"[SUCCESS] Created completed TodoItem with ID: {_testCompletedTodoItemId}");
    }

    [Fact, TestPriority(4)]
    public async Task Success_Should_Get_TodoItem_By_Id_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testTodoItemId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/todo-items/{_testTodoItemId}");

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var todoItem = JsonSerializer.Deserialize<TodoItemResponseDto>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        });

        Assert.NotNull(todoItem);
        Assert.Equal(_testTodoItemId, todoItem.Id);
        Assert.NotEmpty(todoItem.Title);

        _testOutputHelper.WriteLine($"[SUCCESS] Retrieved TodoItem with ID: {todoItem.Id}, Title: {todoItem.Title}");
    }

    [Fact, TestPriority(5)]
    public async Task Success_Should_Get_TodoItem_List_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        // Act
        var response = await HttpClient.GetAsync("/api/v1/todo-items/list");

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var columns = JsonSerializer.Deserialize<List<TodoItemColumnDto>>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        });

        Assert.NotNull(columns);
        Assert.Equal(4, columns.Count); // Backlog, InProgress, Blocked, Completed

        var backlogColumn = columns.FirstOrDefault(c => c.Title == "Backlog");
        Assert.NotNull(backlogColumn);
        Assert.True(backlogColumn.TaskCount >= 0);
        Assert.Equal(backlogColumn.TaskCount, backlogColumn.Items.Count);

        _testOutputHelper.WriteLine($"[SUCCESS] Retrieved TodoItem list with {columns.Count} columns");
        foreach (var column in columns)
        {
            _testOutputHelper.WriteLine($"[INFO] Column: {column.Title}, TaskCount: {column.TaskCount}");
        }
    }

    [Fact, TestPriority(6)]
    public async Task Success_Should_Get_Paged_Archived_TodoItems_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        // Act
        var response = await HttpClient.GetAsync("/api/v1/todo-items/paged?Page=1&PerPage=10&IsArchived=true");

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var pagedResult = JsonSerializer.Deserialize<PagedResult<TodoItemResponseDto>>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        });

        Assert.NotNull(pagedResult);
        Assert.NotNull(pagedResult.Data);
        Assert.True(pagedResult.Meta.TotalCount >= 0);
        Assert.All(pagedResult.Data, item => Assert.True(item.IsArchived));

        _testOutputHelper.WriteLine($"[SUCCESS] Retrieved {pagedResult.Data.Count} archived TodoItems (Total: {pagedResult.Meta.TotalCount})");
    }

    [Fact, TestPriority(7)]
    public async Task Success_Should_Update_TodoItem_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testTodoItemId);
        Assert.NotEqual(Guid.Empty, _testCategoryId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var updateRequest = new UpdateTodoItemRequestDto
        {
            Title = $"Updated TodoItem {Guid.NewGuid():N}",
            Description = "Updated TodoItem description",
            Priority = TodoPriority.Medium,
            DueDate = DateTime.UtcNow.AddDays(14),
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
        var responseBody = await response.Content.ReadAsStringAsync();
        var todoItem = JsonSerializer.Deserialize<TodoItemResponseDto>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        });

        Assert.NotNull(todoItem);
        Assert.Equal(_testTodoItemId, todoItem.Id);
        Assert.Equal(updateRequest.Title, todoItem.Title);
        Assert.Equal(updateRequest.Description, todoItem.Description);
        Assert.Equal(updateRequest.Priority, todoItem.Priority);
        Assert.Equal(updateRequest.CategoryId, todoItem.CategoryId);

        _testOutputHelper.WriteLine($"[SUCCESS] Updated TodoItem with ID: {todoItem.Id}");
    }

    [Fact, TestPriority(8)]
    public async Task Success_Should_Update_TodoItem_Status_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testTodoItemId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var updateStatusRequest = new UpdateTodoItemStatusRequestDto
        {
            Status = TodoStatus.InProgress
        };

        // Act
        var content = new StringContent(
            JsonSerializer.Serialize(updateStatusRequest, new JsonSerializerOptions
            {
                Converters = { new JsonStringEnumConverter() }
            }),
            Encoding.UTF8,
            "application/json"
        );

        var response = await HttpClient.PatchAsync($"/api/v1/todo-items/{_testTodoItemId}/status", content);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var todoItem = JsonSerializer.Deserialize<TodoItemResponseDto>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        });

        Assert.NotNull(todoItem);
        Assert.Equal(_testTodoItemId, todoItem.Id);
        Assert.Equal(TodoStatus.InProgress, todoItem.Status);

        _testOutputHelper.WriteLine($"[SUCCESS] Updated TodoItem status to: {todoItem.Status}");
    }

    [Fact, TestPriority(9)]
    public async Task Success_Should_Archive_TodoItem_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testTodoItemId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        // Act
        var response = await HttpClient.PatchAsync($"/api/v1/todo-items/{_testTodoItemId}/archive", null);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var todoItem = JsonSerializer.Deserialize<TodoItemResponseDto>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        });

        Assert.NotNull(todoItem);
        Assert.Equal(_testTodoItemId, todoItem.Id);
        Assert.True(todoItem.IsArchived);
        Assert.NotNull(todoItem.ArchivedTime);

        _testOutputHelper.WriteLine($"[SUCCESS] Archived TodoItem with ID: {todoItem.Id}");
    }

    [Fact, TestPriority(10)]
    public async Task Success_Should_Archive_Completed_TodoItems_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        // Act
        var response = await HttpClient.PatchAsync("/api/v1/todo-items/archive-completed", null);

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Archived all completed TodoItems");
    }

    [Fact, TestPriority(11)]
    public async Task Failure_Should_Not_Get_TodoItem_With_Invalid_Id_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);
        var invalidId = Guid.NewGuid();

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/todo-items/{invalidId}");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Invalid TodoItem ID correctly rejected");
    }

    [Fact, TestPriority(12)]
    public async Task Failure_Should_Not_Create_TodoItem_Without_Token_Async()
    {
        // Arrange
        HttpClient.DefaultRequestHeaders.Authorization = null;

        var createRequest = new CreateTodoItemRequestDto
        {
            Title = "Test TodoItem",
            CategoryId = Guid.NewGuid()
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
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Unauthorized TodoItem creation correctly rejected");
    }

    [Fact, TestPriority(13)]
    public async Task Failure_Should_Not_Delete_TodoItem_Without_Token_Async()
    {
        // Arrange
        HttpClient.DefaultRequestHeaders.Authorization = null;

        // Act
        var response = await HttpClient.DeleteAsync($"/api/v1/todo-items/{_testTodoItemId}");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Unauthorized TodoItem deletion correctly rejected");
    }

    [Fact, TestPriority(14)]
    public async Task Success_Should_Delete_TodoItem_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testTodoItemId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        // Act
        var response = await HttpClient.DeleteAsync($"/api/v1/todo-items/{_testTodoItemId}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Deleted TodoItem with ID: {_testTodoItemId}");
    }

    [Fact, TestPriority(15)]
    public async Task Failure_Should_Not_Delete_Non_Existent_TodoItem_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);
        var nonExistentId = Guid.NewGuid();

        // Act
        var response = await HttpClient.DeleteAsync($"/api/v1/todo-items/{nonExistentId}");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Non-existent TodoItem deletion correctly rejected");
    }
}

