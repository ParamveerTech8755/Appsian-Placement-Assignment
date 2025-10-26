export interface User {
  id: number;
  email: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  userId: number;
  tasks: ProjectTask[];
}

export interface ProjectTask {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
  projectId: number;
}

export interface CreateProjectDto {
  title: string;
  description?: string;
}

export interface CreateProjectTaskDto {
  title: string;
  dueDate?: string;
}

export interface UpdateProjectTaskDto {
  title: string;
  dueDate?: string;
  isCompleted: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
}

export interface ScheduleRequest {
  availableHoursPerDay: number;
  startDate: string;
}

export interface ScheduledTask {
  taskId: number;
  taskTitle: string;
  scheduledDate: string;
  estimatedHours: number;
}

export interface ScheduleResponse {
  schedule: ScheduledTask[];
}
