using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskHubApi.DTOs;
using TaskHubApi.Interfaces;

namespace TaskHubApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class TaskController : ControllerBase
    {
        private readonly ITaskInterface _taskService;

        public TaskController(ITaskInterface taskService)
        {
            _taskService = taskService;
        }

        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier) 
            ?? throw new UnauthorizedAccessException("User ID not found in claims");
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var tasks = await _taskService.GetTasksAsync(GetUserId());
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id, GetUserId());
            
            if (task == null) return NotFound();
            
            return Ok(task);
        }

        [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
    {
        var task = await _taskService.CreateTaskAsync(dto, GetUserId());
        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskDto dto)
    {
        var success = await _taskService.UpdateTaskAsync(id, dto, GetUserId());
        
        if (!success) return NotFound();
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var success = await _taskService.DeleteTaskAsync(id, GetUserId());
        
        if (!success) return NotFound();
        
        return NoContent();
    }
    }
}