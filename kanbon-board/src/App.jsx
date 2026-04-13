import React, { useState, useEffect } from "react";
import "./App.css";
import TaskModal from "./components/TaskModal";
import TaskCard from "./components/TaskCard";
import Column from "./components/Column";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
    return JSON.parse(savedTasks); 
  }
  return {
    todo: [
      {
        id: "1",
        title: "Fix Login Bug",
        description: "Users unable to login with special characters",
        dueDate: "2023-10-15",
        assignee: "John Doe",
        priority: "High",
      },
      {
        id: "2",
        title: "Update Documentation",
        description: "Update API documentation for v2.0",
        dueDate: "2023-10-20",
        assignee: "Jane Smith",
        priority: "Medium",
      },
    ],
    inProgress: [
      {
        id: "1",
        title: "Design Dashboard",
        description: "Create new dashboard layout",
        dueDate: "2023-10-18",
        assignee: "Alice Brown",
        priority: "High",
      },
    ],
    done: [
      {
        id: "1",
        title: "Deploy v1.5",
        description: "Deploy version 1.5 to production",
        dueDate: "2023-10-10",
        assignee: "David Lee",
        priority: "High",
      },
    ],
  };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [error, setError] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [dropPosition, setDropPosition] = useState(null); // Track drop position {columnId, index}


useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);

  const openAddTaskModal = (columnId) => {
    setCurrentColumn(columnId);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task, columnId) => {
    setEditingTask(task);
    setCurrentColumn(columnId);
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setCurrentColumn(null);
  };


  const handleSaveTask = (taskData) => {
    try {
      if (!taskData.title.trim()) {
        setError("Task title is required");
        return;
      }

      if (!taskData.dueDate) {
        setError("Due date is required");
        return;
      }

      setError("");
      setTasks((prevTasks) => {
        const newTasks = JSON.parse(JSON.stringify(prevTasks));

        if (editingTask) {
          const columnKey = currentColumn;
          const taskIndex = newTasks[columnKey].findIndex(
            (t) => t.id === editingTask.id
          );
          if (taskIndex !== -1) {
            newTasks[columnKey][taskIndex] = { ...taskData, id: editingTask.id };
          }
        } else {
          const newTask = {
            ...taskData,
            id: Date.now().toString(),
          };
          newTasks[currentColumn].push(newTask);
        }

        return newTasks;
      });

      closeModal();
    } catch (err) {
      setError("Failed to save task. Please try again.");
    }
  };

  const deleteTask = (columnId, taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    try {
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        newTasks[columnId] = newTasks[columnId].filter((t) => t.id !== taskId);
        return newTasks;

      });
      setError("");
    } catch (err) {
      setError("Failed to delete task");
    }
  };


  const handleDragStart = (e, task, columnId) => {
    setDraggedTask({ task, columnId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedTask) return;
    const { task, columnId } = draggedTask;
    if (columnId !== targetColumnId) {
      try {
        setTasks((prevTasks) => {
          const newTasks = { ...prevTasks };
          newTasks[columnId] = newTasks[columnId].filter((t) => t.id !== task.id);
          newTasks[targetColumnId] = [...newTasks[targetColumnId], task];
          console.log("Task moved successfully"); 
          return newTasks;
        });
        setError("");
      } catch (err) {
        setError("Failed to move task");
      }
    }
    setDraggedTask(null);
  };

  const filterTasks = (taskList) => {
    return taskList.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  };

  const columns = [
    { id: "todo", title: "To Do", color: "bg-blue-50" },
    { id: "inProgress", title: "In Progress", color: "bg-yellow-50" },
    { id: "done", title: "Done", color: "bg-green-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[250px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <div className="flex gap-2 flex-wrap">
              {["High", "Medium", "Low"].map((priority) => (
                <button
                  key={priority}
                  onClick={() =>
                    setPriorityFilter(priorityFilter === priority ? null : priority)
                  }
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    priorityFilter === priority
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {priority}
                </button>
              ))}
               
            </div>

            {(searchTerm || priorityFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPriorityFilter(null);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear Filters
              </button>
            )}


         
          </div>
        </div>
      </div>


      {error && (
        <div className="max-w-7xl mx-auto px-6 py-3 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-800 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-900 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Columns */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={filterTasks(tasks[column.id])}
              onAddTask={() => openAddTaskModal(column.id)}
              onEditTask={(task) => openEditTaskModal(task, column.id)}
              onDeleteTask={(taskId) => deleteTask(column.id, taskId)}
              onDragStart={(e, task) => handleDragStart(e, task, column.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            />
          ))}
        </div>
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={closeModal}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}

export default App;
