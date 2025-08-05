import type { Task } from "../types";
import { GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Props = {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    dragProps?: React.HTMLAttributes<HTMLDivElement>;
};

export default function TaskCard({ task, onEdit, onDelete, dragProps }: Props) {
  const supabase = createClientComponentClient();
  const [fullName, setFullName] = useState("User");

  useEffect(() => {
    const fetchName = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile?.full_name) {
          setFullName(profile.full_name);
        }
      }
    };

    fetchName();
  }, [supabase]);

  const initials =
    fullName &&
    fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3 shadow-sm">
      {/* Title */}
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-sm truncate">{task.title}</p>
        <span title="Drag" {...dragProps}>
          <GripVertical
            className="cursor-grab text-gray-400 hover:text-black"
            size={16}
          />
        </span>
      </div>

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
          {initials || <span className="animate-pulse text-gray-400">...</span>}
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
      {task.category && (
        <div className="text-[11px] text-gray-500 italic my-2">
          🏷️ {task.category}
        </div>
      )}
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
        <div
          className={`
      h-full rounded-full transition-all
      ${
        task.completion === 100
          ? "bg-green-600"
          : task.completion >= 75
          ? "bg-emerald-500"
          : task.completion >= 50
          ? "bg-yellow-500"
          : "bg-gray-400"
      }
    `}
          style={{ width: `${task.completion}%` }}
        ></div>
      </div>
    </div>
  );
}
