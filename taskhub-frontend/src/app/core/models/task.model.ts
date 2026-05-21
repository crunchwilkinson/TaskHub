export interface TaskDto {
  id: number;
  title: string;
  description?: string; // The '?' means this property is optional
  isCompleted: boolean;
  createdAt: Date;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}