using Microsoft.EntityFrameworkCore;
using TaskHubApi.Data;
using TaskHubApi.DTOs;
using TaskHubApi.Interfaces;
using TaskHubApi.Models;

namespace TaskHubApi.Services
{
    public class TaskService : ITaskInterface
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<TaskDto> CreateTaskAsync(CreateTaskDto dto, string userId)
        {
            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                UserId = userId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return new TaskDto(task.Id, task.Title, task.Description, task.IsCompleted, task.CreatedAt);
        }

        public async Task<bool> DeleteTaskAsync(int id, string userId)
        {
            var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<TaskDto?> GetTaskByIdAsync(int id, string userId)
        {
            var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null) return null;

            return new TaskDto(task.Id, task.Title, task.Description, task.IsCompleted, task.CreatedAt);
        }

        public async Task<IEnumerable<TaskDto>> GetTasksAsync(string userId)
        {
            return await _context.Tasks
            .Where(t => t.UserId == userId)
            .Select(t => new TaskDto(t.Id, t.Title, t.Description, t.IsCompleted, t.CreatedAt))
            .ToListAsync();
        }

        public async Task<bool> UpdateTaskAsync(int id, UpdateTaskDto dto, string userId)
        {
            var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null) return false;

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.IsCompleted = dto.IsCompleted;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}