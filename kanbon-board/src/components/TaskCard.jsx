import React from "react";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onDragStart,
}) => {
  const priorityColors = {
    High: "bg-red-100 text-red-800 border-red-300",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Low: "bg-green-100 text-green-800 border-green-300",
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-move group"
    >
      {/* Header with Priority */}
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 flex-1 text-sm line-clamp-2">
          {task.title}
        </h3>
        <span
          className={`px-2 py-1 rounded text-xs font-medium border ${
            priorityColors[task.priority] || priorityColors["Medium"]
          } flex-shrink-0`}
        >
          {task.priority}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Meta Info */}
      <div className="space-y-2 mb-3 text-xs text-gray-500">
        {task.dueDate && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Due:</span>
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
        {task.assignee && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Assigned to:</span>
            <span>{task.assignee}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
