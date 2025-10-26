import React from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import type { ScheduledTask } from "../types/project.types";

interface ScheduleViewProps {
  schedule: ScheduledTask[];
  totalHours: number;
  totalDays: number;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedule,
  totalHours,
  totalDays,
}) => {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Total Workload</p>
            <p className="text-2xl font-bold text-blue-900">
              {totalHours} hours
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">Estimated Days</p>
            <p className="text-2xl font-bold text-blue-900">{totalDays} days</p>
          </div>
        </div>
      </div>

      {/* Task Schedule */}
      <div className="space-y-2">
        {schedule.map((task, index) => {
          const scheduledDate = new Date(task.scheduledDate);
          const dueDate = new Date(task.dueDate);
          const isLate = scheduledDate > dueDate;

          return (
            <div
              key={task.taskId}
              className={`p-4 rounded-lg border-l-4 ${
                isLate
                  ? "bg-red-50 border-red-500"
                  : "bg-white border-green-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500">
                      Day {index + 1}
                    </span>
                    {isLate && (
                      <span className="flex items-center space-x-1 text-xs text-red-600 font-semibold">
                        <AlertCircle size={12} />
                        <span>Will miss deadline!</span>
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-gray-800">{task.taskTitle}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Start: {scheduledDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar
                        size={14}
                        className={isLate ? "text-red-600" : ""}
                      />
                      <span
                        className={isLate ? "text-red-600 font-medium" : ""}
                      >
                        Due: {dueDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-blue-600 font-semibold">
                  <Clock size={16} />
                  <span>{task.estimatedHours}h</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
