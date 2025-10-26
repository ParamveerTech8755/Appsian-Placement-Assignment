import { useState, useEffect } from "react";
import type { Project, CreateProjectDto } from "../types/project.types";
import { projectService } from "../services/projectService";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (dto: CreateProjectDto) => {
    setError(null);
    try {
      const newProject = await projectService.createProject(dto);
      setProjects([...projects, newProject]);
    } catch (err: any) {
      setError(err.message || "Failed to create project");
    }
  };

  const deleteProject = async (id: number) => {
    setError(null);
    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete project");
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    deleteProject,
    refetch: fetchProjects,
  };
};
