import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { projectService } from "../services/projectService";
import { schedulerService } from "../services/schedulerService";
import type { ProjectTask } from "../types/project.types";
import { ProjectTaskItem } from "../components/ProjectTaskItem";
import { ScheduleView } from "../components/ScheduleView";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { ArrowLeft, Plus, Calendar as CalendarIcon } from "lucide-react";

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [schedule, setSchedule] = useState<any>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskHours, setNewTaskHours] = useState(4);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjectTasks(parseInt(projectId!));
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDueDate) {
      setError("Title and due date are required");
      return;
    }

    try {
      const newTask = await projectService.createTask(parseInt(projectId!), {
        title: newTaskTitle,
        dueDate: newTaskDueDate,
        estimatedHours: newTaskHours,
      });
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
      setNewTaskDueDate("");
      setNewTaskHours(4);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleTask = async (task: ProjectTask) => {
    try {
      const updated = await projectService.updateTask(task.id, {
        title: task.title,
        dueDate: task.dueDate,
        estimatedHours: task.estimatedHours,
        isCompleted: !task.isCompleted,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await projectService.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGenerateSchedule = async () => {
    try {
      const result = await schedulerService.generateSchedule(
        parseInt(projectId!),
        { startDate },
      );
      setSchedule(result);
      setShowScheduler(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const totalHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Projects</span>
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Project Tasks
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>
                  {completedTasks} of {tasks.length} tasks completed
                </span>
                <span>•</span>
                <span>{totalHours} total hours</span>
              </div>
            </div>
            <button
              onClick={() => setShowScheduler(!showScheduler)}
              disabled={tasks.length === 0}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <CalendarIcon size={18} />
              <span>Smart Schedule</span>
            </button>
          </div>

          {error && <ErrorMessage message={error} />}

          <form
            onSubmit={handleCreateTask}
            className="mb-6 bg-gray-50 p-4 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title *"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={newTaskHours}
                  onChange={(e) => setNewTaskHours(parseInt(e.target.value))}
                  min={1}
                  max={100}
                  required
                  className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">hours</span>
              </div>
              <button
                type="submit"
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>Add Task</span>
              </button>
            </div>
          </form>

          {showScheduler && (
            <div className="bg-purple-50 rounded-lg p-6 mb-6 border border-purple-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Smart Schedule - Earliest Deadline First
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleGenerateSchedule}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg transition-colors font-medium"
                  >
                    Generate Schedule
                  </button>
                </div>
              </div>

              {schedule && (
                <ScheduleView
                  schedule={schedule.schedule}
                  totalHours={schedule.totalHours}
                  totalDays={schedule.totalDays}
                />
              )}
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No tasks yet. Add one to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <ProjectTaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
