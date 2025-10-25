import React from "react";
import type { FilterType, TaskStats } from "../types/task.types";

interface FilterButtonsProps {
  currentFilter: FilterType;
  stats: TaskStats;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentFilter,
  stats,
  onFilterChange,
}) => {
  const filters: { label: string; value: FilterType; count: number }[] = [
    { label: "All", value: "all", count: stats.total },
    { label: "Active", value: "active", count: stats.active },
    { label: "Completed", value: "completed", count: stats.completed },
  ];

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentFilter === filter.value
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  );
};
