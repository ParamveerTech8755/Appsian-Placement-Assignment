import React from "react";
import { Calendar, Clock } from "lucide-react";
import type { ScheduledTask } from "../types/project.types";

interface ScheduleViewProps {
  schedule: ScheduledTask[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule }) => {
  const groupedByDate = schedule.reduce(
    (acc, task) => {
      const date = new Date(task.scheduledDate).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(task);
      return acc;
    },
    {} as Record<string, ScheduledTask[]>,
  );

  return (
    <div className="space-y-4">
      {Object.entries(groupedByDate).map(([date, tasks]) => (
        <div key={date} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b">
            <Calendar size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">{date}</h3>
            <span className="ml-auto text-sm text-gray-500">
              {tasks.reduce((sum, t) => sum + t.estimatedHours, 0)} hours
            </span>
          </div>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.taskId}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
              >
                <span className="text-gray-700">{task.taskTitle}</span>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>{task.estimatedHours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
