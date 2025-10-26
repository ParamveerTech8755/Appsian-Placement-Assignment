import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, CheckSquare, FolderKanban } from "lucide-react";
import { authUtils } from "../utils/auth.utils";
import { authService } from "../services/authService";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = authUtils.getUserData();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-xl font-bold text-blue-600"
            >
              <FolderKanban size={28} />
              Task Manager Pro
            </Link>
            <div className="hidden md:flex gap-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Projects
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
