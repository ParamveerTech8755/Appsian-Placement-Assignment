import React from "react";
import { Trash2, FolderOpen, Calendar } from "lucide-react";
import type { Project } from "../types/project.types";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: number) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onDelete,
}) => {
  const navigate = useNavigate();

  const totalTasks = project.tasks?.length || 0;
  const completedTasks =
    project.tasks?.filter((t) => t.isCompleted).length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FolderOpen className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {project.title}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Calendar size={14} />
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(project.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {project.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>
            {completedTasks} / {totalTasks} tasks
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/projects/${project.id}`)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
      >
        View Project
      </button>
    </div>
  );
};
