import React from "react";
import { TaskItem } from "./TaskItem";
import type { Task, FilterType } from "../types/task.types";

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onToggle,
  onDelete,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">
          {filter === "all"
            ? "No tasks yet. Add one to get started!"
            : filter === "active"
              ? "No active tasks. Great job!"
              : "No completed tasks yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
