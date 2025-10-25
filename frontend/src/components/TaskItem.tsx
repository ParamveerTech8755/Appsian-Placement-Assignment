import React from "react";
import { Trash2, Check } from "lucide-react";
import type { Task } from "../types/task.types";

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
      <button
        onClick={() => onToggle(task)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          task.isCompleted
            ? "bg-green-500 border-green-500"
            : "border-gray-300 hover:border-green-500"
        }`}
        aria-label={
          task.isCompleted ? "Mark as incomplete" : "Mark as complete"
        }
      >
        {task.isCompleted && <Check size={16} className="text-white" />}
      </button>

      <span
        className={`flex-1 transition-all ${
          task.isCompleted ? "line-through text-gray-400" : "text-gray-700"
        }`}
      >
        {task.description}
      </span>

      <span className="text-xs text-gray-400 hidden sm:inline">
        {new Date(task.createdAt).toLocaleDateString()}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Delete task"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
