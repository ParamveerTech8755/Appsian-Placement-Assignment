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

export interface CreateProjectDto {
  title: string;
  description?: string;
}
export interface ProjectTask {
  id: number;
  title: string;
  dueDate: string; // Required, not optional
  estimatedHours: number; // NEW: Required
  isCompleted: boolean;
  createdAt: string;
  projectId: number;
}

export interface CreateProjectTaskDto {
  title: string;
  dueDate: string; // Required
  estimatedHours: number; // NEW: Required
}

export interface UpdateProjectTaskDto {
  title: string;
  dueDate: string; // Required
  estimatedHours: number; // NEW: Required
  isCompleted: boolean;
}

export interface ScheduleRequest {
  startDate: string; // Removed availableHoursPerDay
}

export interface ScheduledTask {
  taskId: number;
  taskTitle: string;
  scheduledDate: string;
  dueDate: string; // NEW
  estimatedHours: number;
}

export interface ScheduleResponse {
  schedule: ScheduledTask[];
  totalHours: number; // NEW
  totalDays: number; // NEW
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
