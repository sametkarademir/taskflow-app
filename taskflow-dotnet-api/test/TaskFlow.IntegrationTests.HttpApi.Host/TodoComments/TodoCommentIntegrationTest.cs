using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using TaskFlow.Application.Contracts.Categories;
using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.Application.Contracts.TodoComments;
using TaskFlow.Application.Contracts.TodoItems;
using TaskFlow.Domain.Shared.TodoItems;
using TaskFlow.IntegrationTests.Base.Base;
using TaskFlow.IntegrationTests.Base.Common;
using Xunit;
using Xunit.Abstractions;

namespace TaskFlow.IntegrationTests.HttpApi.Host.TodoComments;

[Collection("Feature Tests")]
[TestCaseOrderer("TaskFlow.IntegrationTests.Base.Common.PriorityOrderer", "TaskFlow.IntegrationTests.Base")]
public class TodoCommentIntegrationTest : BaseIntegrationTest
{
    private readonly ITestOutputHelper _testOutputHelper;
    private static Guid _testCategoryId = Guid.Empty;
    private static Guid _testTodoItemId = Guid.Empty;
    private static Guid _testTodoCommentId = Guid.Empty;

    public TodoCommentIntegrationTest(IntegrationTestWebAppFactory factory, ITestOutputHelper testOutputHelper) : base(factory)
    {
        _testOutputHelper = testOutputHelper;
    }

    [Fact, TestPriority(1)]
    public async Task Success_Should_Create_Category_For_TodoComment_Tests_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var createRequest = new CreateCategoryRequestDto
        {
            Name = $"TodoComment Test Category {Guid.NewGuid():N}",
            Description = "Category for TodoComment integration tests",
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
        _testOutputHelper.WriteLine($"[SUCCESS] Created category for TodoComment tests with ID: {_testCategoryId}");
    }

    [Fact, TestPriority(2)]
    public async Task Success_Should_Create_TodoItem_For_TodoComment_Tests_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testCategoryId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var createRequest = new CreateTodoItemRequestDto
        {
            Title = $"TodoComment Test TodoItem {Guid.NewGuid():N}",
            Description = "TodoItem for TodoComment integration tests",
            Status = TodoStatus.Backlog,
            Priority = TodoPriority.Medium,
            CategoryId = _testCategoryId
        };

        // Act
        var content = new StringContent(
            JsonSerializer.Serialize(createRequest),
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
        _testTodoItemId = todoItem.Id;
        _testOutputHelper.WriteLine($"[SUCCESS] Created TodoItem for TodoComment tests with ID: {_testTodoItemId}");
    }

    [Fact, TestPriority(3)]
    public async Task Success_Should_Create_TodoComment_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testTodoItemId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        var createRequest = new CreateTodoCommentRequestDto
        {
            Content = $"Test TodoComment {Guid.NewGuid():N} - This is a test comment for integration tests."
        };

        // Act
        var content = new StringContent(
            JsonSerializer.Serialize(createRequest),
            Encoding.UTF8,
            "application/json"
        );

        var response = await HttpClient.PostAsync($"/api/v1/todo-items/{_testTodoItemId}/comments", content);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var todoComment = JsonSerializer.Deserialize<TodoCommentResponseDto>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        });

        Assert.NotNull(todoComment);
        Assert.NotEqual(Guid.Empty, todoComment.Id);
        Assert.Equal(createRequest.Content, todoComment.Content);
        Assert.Equal(_testTodoItemId, todoComment.TodoItemId);
        Assert.NotEqual(Guid.Empty, todoComment.UserId);

        _testTodoCommentId = todoComment.Id;
        _testOutputHelper.WriteLine($"[SUCCESS] Created TodoComment with ID: {_testTodoCommentId}");
    }

    [Fact, TestPriority(4)]
    public async Task Success_Should_Get_Paged_TodoComments_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        Assert.NotEqual(Guid.Empty, _testTodoItemId);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/todo-items/{_testTodoItemId}/comments/paged?Page=1&PerPage=10");

        // Assert
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        var pagedResult = JsonSerializer.Deserialize<PagedResult<TodoCommentResponseDto>>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        });

        Assert.NotNull(pagedResult);
        Assert.NotNull(pagedResult.Data);
        Assert.True(pagedResult.Meta.TotalCount >= 0);
        Assert.All(pagedResult.Data, comment => Assert.Equal(_testTodoItemId, comment.TodoItemId));

        _testOutputHelper.WriteLine($"[SUCCESS] Retrieved {pagedResult.Data.Count} TodoComments (Total: {pagedResult.Meta.TotalCount})");
    }

    [Fact, TestPriority(5)]
    public async Task Failure_Should_Not_Create_TodoComment_Without_Token_Async()
    {
        // Arrange
        HttpClient.DefaultRequestHeaders.Authorization = null;

        var createRequest = new CreateTodoCommentRequestDto
        {
            Content = "Test comment"
        };

        // Act
        var content = new StringContent(
            JsonSerializer.Serialize(createRequest),
            Encoding.UTF8,
            "application/json"
        );

        var response = await HttpClient.PostAsync($"/api/v1/todo-items/{_testTodoItemId}/comments", content);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Unauthorized TodoComment creation correctly rejected");
    }

    [Fact, TestPriority(6)]
    public async Task Failure_Should_Not_Create_TodoComment_With_Invalid_TodoItemId_Async()
    {
        // Arrange
        Assert.NotEmpty(AdminAccessToken);
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", AdminAccessToken);
        var invalidTodoItemId = Guid.NewGuid();

        var createRequest = new CreateTodoCommentRequestDto
        {
            Content = "Test comment"
        };

        // Act
        var content = new StringContent(
            JsonSerializer.Serialize(createRequest),
            Encoding.UTF8,
            "application/json"
        );

        var response = await HttpClient.PostAsync($"/api/v1/todo-items/{invalidTodoItemId}/comments", content);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Invalid TodoItemId correctly rejected");
    }

    [Fact, TestPriority(7)]
    public async Task Failure_Should_Not_Get_TodoComments_Without_Token_Async()
    {
        // Arrange
        HttpClient.DefaultRequestHeaders.Authorization = null;

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/todo-items/{_testTodoItemId}/comments/paged");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        _testOutputHelper.WriteLine($"[SUCCESS] Unauthorized TodoComments retrieval correctly rejected");
    }
}

