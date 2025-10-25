import { useState, useEffect } from "react";
import type {
  Task,
  // CreateTaskDto,
  // UpdateTaskDto,
  FilterType,
} from "../types/task.types";
import { taskService } from "../services/taskService";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(
        "Unable to connect to server. Make sure the backend is running on port 5000.",
      );
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (description: string) => {
    if (!description.trim()) return;

    setError(null);
    try {
      const newTask = await taskService.createTask({ description });
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError("Failed to add task");
      console.error("Error adding task:", err);
    }
  };

  const toggleTask = async (task: Task) => {
    setError(null);
    try {
      const updatedTask = await taskService.updateTask(task.id, {
        description: task.description,
        isCompleted: !task.isCompleted,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (err) {
      setError("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id: number) => {
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.isCompleted;
    if (filter === "completed") return task.isCompleted;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.isCompleted).length,
    completed: tasks.filter((t) => t.isCompleted).length,
  };

  return {
    tasks: filteredTasks,
    stats,
    filter,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    setFilter,
  };
};
