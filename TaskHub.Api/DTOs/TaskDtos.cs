namespace TaskHub.Api.DTOs
{
    public record TaskDto(int Id, string Title, string? Description, bool IsCompleted, DateTime CreatedAt);
    public record CreateTaskDto(string Title, string? Description);
    public record UpdateTaskDto(string Title, string? Description, bool IsCompleted);
}