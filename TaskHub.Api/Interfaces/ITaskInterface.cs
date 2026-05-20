using TaskHub.Api.DTOs;

namespace TaskHub.Api.Interfaces
{
    public interface ITaskInterface
    {
        Task<IEnumerable<TaskDto>> GetTasksAsync(string userId);
        Task<TaskDto?> GetTaskByIdAsync(int id, string userId);
        Task<TaskDto> CreateTaskAsync(CreateTaskDto dto, string userId);
        Task<bool> UpdateTaskAsync(int id, UpdateTaskDto dto, string userId);
        Task<bool> DeleteTaskAsync(int id, string userId);
    }
}