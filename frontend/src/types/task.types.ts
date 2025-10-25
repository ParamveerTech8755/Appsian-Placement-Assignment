export interface Task {
  id: number;
  description: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface CreateTaskDto {
  description: string;
}

export interface UpdateTaskDto {
  description: string;
  isCompleted: boolean;
}

export type FilterType = "all" | "active" | "completed";

export interface TaskStats {
  total: number;
  active: number;
  completed: number;
}
