import React from "react";
import TaskCard from "./TaskCard";

const Column = ({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnterCard,
  onDragLeaveColumn,
  dropPosition,
}) => {
  const columnIcons = {
    todo: "📋",
    inProgress: "⚙️",
    done: "✅",
  };

  const handleDropOnZone = (e, insertIndex) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop(e, insertIndex);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, tasks.length)}
      onDragLeave={onDragLeaveColumn}
      className={`${column.color} rounded-lg border border-gray-200 flex flex-col h-full`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{columnIcons[column.id]}</span>
          <h2 className="text-lg font-bold text-gray-900">{column.title}</h2>
          <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {tasks.length === 0
            ? "No tasks"
            : `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {tasks.length === 0 ? (
          <div 
            className="flex items-center justify-center h-full text-center"
            onDragOver={onDragOver}
            onDrop={(e) => handleDropOnZone(e, 0)}
          >
            <div className="text-gray-400">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm">No tasks yet</p>
              <p className="text-xs text-gray-300">Add one to get started</p>
            </div>
          </div>
        ) : (
          <>
            {/* Top drop zone */}
            {dropPosition?.columnId === column.id && dropPosition?.index === 0 && (
              <div className="h-1 bg-blue-400 rounded-full my-2 animate-pulse"></div>
            )}
            
            {tasks.map((task, index) => (
              <div key={task.id}>
                <div
                  onDragEnter={() => onDragEnterCard(index)}
                  onDragLeave={onDragLeaveColumn}
                >
                  <TaskCard
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onDragStart={(e) => onDragStart(e, task)}
                  />
                </div>
                
                {/* Drop zone between tasks */}
                {dropPosition?.columnId === column.id && 
                 dropPosition?.index === index + 1 && (
                  <div className="h-1 bg-blue-400 rounded-full my-2 animate-pulse"></div>
                )}
                
                {/* Hover zone for next position */}
                {index < tasks.length - 1 && (
                  <div
                    className="h-2 hover:h-3 transition-all"
                    onDragOver={onDragOver}
                    onDragEnter={() => onDragEnterCard(index + 1)}
                    onDragLeave={onDragLeaveColumn}
                    onDrop={(e) => handleDropOnZone(e, index + 1)}
                  />
                )}
              </div>
            ))}
            
            {/* Bottom drop zone */}
            {dropPosition?.columnId === column.id && 
             dropPosition?.index === tasks.length && (
              <div className="h-1 bg-blue-400 rounded-full my-2 animate-pulse"></div>
            )}
            <div
              className="h-2 hover:h-3 transition-all"
              onDragOver={onDragOver}
              onDragEnter={() => onDragEnterCard(tasks.length)}
              onDragLeave={onDragLeaveColumn}
              onDrop={(e) => handleDropOnZone(e, tasks.length)}
            />
          </>
        )}
      </div>

      {/* Add Task Button */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <button
          onClick={onAddTask}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span>
          Add Task
        </button>
      </div>
    </div>
  );
};

export default Column;
