import React from "react";
import { Trash2, Check, Calendar } from "lucide-react";
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
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg transition-colors group ${
        isOverdue
          ? "bg-red-50 hover:bg-red-100"
          : "bg-gray-50 hover:bg-gray-100"
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
          className={`block ${
            task.isCompleted ? "line-through text-gray-400" : "text-gray-700"
          }`}
        >
          {task.title}
        </span>
        {task.dueDate && (
          <span
            className={`text-xs flex items-center gap-1 mt-1 ${
              isOverdue ? "text-red-600 font-medium" : "text-gray-500"
            }`}
          >
            <Calendar size={12} />
            Due: {new Date(task.dueDate).toLocaleDateString()}
            {isOverdue && " (Overdue)"}
          </span>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
