import type {
  Project,
  CreateProjectDto,
  ProjectTask,
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
} from "../types/project.types";
import { authUtils } from "../utils/auth.utils";

const API_BASE_URL =
  "https://appsian-placement-assignment-project.onrender.com/api";

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: authUtils.getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch projects");
    return response.json();
  },

  async createProject(dto: CreateProjectDto): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: authUtils.getAuthHeaders(),
      body: JSON.stringify(dto),
    });

    if (!response.ok) throw new Error("Failed to create project");
    return response.json();
  },

  async deleteProject(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: authUtils.getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete project");
  },

  async getProjectTasks(projectId: number): Promise<ProjectTask[]> {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/tasks`,
      {
        headers: authUtils.getAuthHeaders(),
      },
    );

    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },

  async createTask(
    projectId: number,
    dto: CreateProjectTaskDto,
  ): Promise<ProjectTask> {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/tasks`,
      {
        method: "POST",
        headers: authUtils.getAuthHeaders(),
        body: JSON.stringify(dto),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    return response.json();
  },

  async updateTask(
    taskId: number,
    dto: UpdateProjectTaskDto,
  ): Promise<ProjectTask> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: authUtils.getAuthHeaders(),
      body: JSON.stringify(dto),
    });

    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  },

  async deleteTask(taskId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: authUtils.getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete task");
  },
};
