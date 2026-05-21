import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskDto, CreateTaskDto } from '../models/task.model';

@Injectable({
  providedIn: 'root' // This makes the service a singleton, available globally
})
export class TaskService {
  private http = inject(HttpClient);
  // Ensure this port matches your .NET local server!
  private apiUrl = 'http://localhost:5142/api/Task'; 

  // GET: Fetch all tasks for the logged-in user
  getTasks(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(this.apiUrl);
  }

  // POST: Create a new task
  createTask(task: CreateTaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(this.apiUrl, task);
  }

  // PUT: Update a task's status
  updateTask(id: number, task: TaskDto): Observable<void> {
    // We pass the full task object to the backend to update it
    return this.http.put<void>(`${this.apiUrl}/${id}`, task);
  }

  // DELETE: Remove a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}