import React from "react";
import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "./components/TaskForm";
import { FilterButtons } from "./components/FilterButtons";
import { TaskList } from "./components/TaskList";
import { ErrorMessage } from "./components/ErrorMessage";
import { LoadingSpinner } from "./components/LoadingSpinner";

function App() {
  const {
    tasks,
    stats,
    filter,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    setFilter,
  } = useTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Task Manager
            </h1>
            <p className="text-gray-500">Stay organized and productive</p>
          </div>

          {/* Error Message */}
          {error && <ErrorMessage message={error} />}

          {/* Task Form */}
          <TaskForm onAddTask={addTask} />

          {/* Filter Buttons */}
          <FilterButtons
            currentFilter={filter}
            stats={stats}
            onFilterChange={setFilter}
          />

          {/* Task List or Loading */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <TaskList
              tasks={tasks}
              filter={filter}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
