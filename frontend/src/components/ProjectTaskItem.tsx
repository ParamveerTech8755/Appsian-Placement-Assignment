import React from "react";
import { Trash2, Check, Calendar, Clock } from "lucide-react";
import type { ProjectTask } from "../types/project.types";

interface ProjectTaskItemProps {
  task: ProjectTask;
  onToggle: (task: ProjectTask) => void;
  onDelete: (id: number) => void;
}

export const ProjectTaskItem: React.FC<ProjectTaskItemProps> = ({
  task,
  onToggle,
  onDelete,
}) => {
  const isOverdue = !task.isCompleted && new Date(task.dueDate) < new Date();

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors ${
        isOverdue
          ? "bg-red-50 border border-red-200"
          : "bg-white border border-gray-200"
      }`}
    >
      <button
        onClick={() => onToggle(task)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          task.isCompleted
            ? "bg-green-500 border-green-500"
            : "border-gray-300 hover:border-green-500"
        }`}
      >
        {task.isCompleted && <Check size={16} className="text-white" />}
      </button>

      <div className="flex-1">
        <span
          className={`block font-medium ${
            task.isCompleted
              ? "line-through text-gray-400"
              : isOverdue
                ? "text-red-700"
                : "text-gray-700"
          }`}
        >
          {task.title}
        </span>
        <div className="flex items-center gap-4 mt-1">
          <div
            className={`flex items-center space-x-1 text-xs ${
              isOverdue ? "text-red-600 font-semibold" : "text-gray-500"
            }`}
          >
            <Calendar size={12} />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            {isOverdue && <span>(Overdue!)</span>}
          </div>
          <div className="flex items-center space-x-1 text-xs text-blue-600">
            <Clock size={12} />
            <span>{task.estimatedHours}h</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
