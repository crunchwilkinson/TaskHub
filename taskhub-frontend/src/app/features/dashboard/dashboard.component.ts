import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskDto } from '../../core/models/task.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
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
  isLoading = true;

  // This variable tracks which task is currently being edited, if any. It's null when not editing.
  editingTaskId: number | null = null; 

  // Define the Add Task form
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  // Form for editing existing tasks
  editTaskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  // Runs automatically when the component loads
  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true; // Start loading
    
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false; // Stop loading on success
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.isLoading = false; // Stop loading on error
      }
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

  startEditing(task: TaskDto): void {
    this.editingTaskId = task.id; // Set the ID of the task being edited
    this.editTaskForm.patchValue({
      title: task.title,
      description: task.description || ''
    });
  }

  cancelEdit() : void {
    this.editingTaskId = null; // Exit edit mode
    this.editTaskForm.reset(); // Clear the edit form
  }

  // Save the modified task
  saveEdit(task: TaskDto) : void {
    if (this.editTaskForm.invalid) return;

    const updatedTask : TaskDto = {
      ...task,
      title: this.editTaskForm.value.title!,
      description: this.editTaskForm.value.description || undefined
    };

    // Send to the backend
    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        // Update the task in the local array so the UI reflects the change
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        // Exit edit mode
        this.editingTaskId = null;
      },
      error: (err) => console.error('Failed to update task', err)
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
