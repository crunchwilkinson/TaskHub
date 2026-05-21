import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskDto } from '../../core/models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // Optional for styling
})
export class DashboardComponent implements OnInit {
  // Inject dependencies
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // State: This array holds the data displayed in the UI
  tasks: TaskDto[] = [];

  // Define the Add Task form
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  // Runs automatically when the component loads
  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  addTask(): void {
    if (this.taskForm.invalid) return;

    // Extract the form values and cast them to our DTO
    const newTask = this.taskForm.value as { title: string; description?: string };

    this.taskService.createTask(newTask).subscribe({
      next: (createdTask) => {
        // Add the new task to the top of our array without refreshing the page
        this.tasks.unshift(createdTask);
        // Clear the form
        this.taskForm.reset();
      },
      error: (err) => console.error('Failed to create task', err)
    });
  }

  toggleCompletion(task: TaskDto): void {
    // Flip the local state immediately for a snappy UI
    task.isCompleted = !task.isCompleted;

    // Send the update to the backend
    this.taskService.updateTask(task.id, task).subscribe({
      error: (err) => {
        // If the server fails, revert the checkbox
        task.isCompleted = !task.isCompleted;
        console.error('Failed to update task', err);
      }
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        // Remove the task from the array so it disappears from the screen
        this.tasks = this.tasks.filter(t => t.id !== id);
      },
      error: (err) => console.error('Failed to delete task', err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
