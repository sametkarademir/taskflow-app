namespace TaskFlow.Application.Contracts.TodoItems;

public class TodoItemColumnDto
{
    public string Title { get; set; } = null!;
    public int TaskCount { get; set; }
    public List<TodoItemResponseDto> Items { get; set; } = [];
}

