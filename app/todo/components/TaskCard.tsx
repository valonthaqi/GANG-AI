import type { Task } from "../types";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  // Dummy user initials based on name (hardcoded fallback for now)
  const fullName = "Valon Thaqi"; // Replace with real user data later
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3 shadow-sm">
      {/* Title */}
      <p className="font-semibold text-sm mb-1 truncate">{task.title}</p>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Due Date + Completion */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          📅
          <span>
            {task.due_date
              ? new Date(task.due_date).toLocaleDateString()
              : "No due date"}
          </span>
        </div>

        <span
          className={`text-xs font-semibold ${
            task.completion === 100
              ? "text-green-600"
              : task.completion >= 75
              ? "text-emerald-500"
              : task.completion >= 50
              ? "text-yellow-500"
              : "text-gray-400"
          }`}
        >
          {task.completion}%
        </span>
      </div>

      {/* Bottom row */}
      <div className="flex justify-between items-center">
        {/* 👤 Initials circle */}
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-xs p-4 font-bold text-gray-700">
          {initials}
        </div>

        {/* ✏️ 🗑️ Edit / Delete */}
        <div className="flex gap-3 text-xs">
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevents drag trigger
              onEdit(task); // or onDelete(task.id)
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-gray-500 hover:text-black"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              onDelete(task.id); 
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
