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
      <div className="flex justify-between items-start mb-1">
        <div className="flex flex-col">
          {task.recurring_days && task.recurring_days.length > 0 && (
            <span className="block text-xs text-blue-500 bg-blue-100 px-2 py-0.5 rounded w-max mb-1">
              {(() => {
                const days = task.recurring_days;
                const allDays = [
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ];
                const weekdays = [
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                ];
                const weekends = ["saturday", "sunday"];

                const isEveryDay = allDays.every((day) => days.includes(day));
                const isWeekdays =
                  weekdays.every((day) => days.includes(day)) &&
                  days.length === 5;
                const isWeekends =
                  weekends.every((day) => days.includes(day)) &&
                  days.length === 2;

                if (isEveryDay) return "Repeats every day";
                if (isWeekdays) return "Repeats on weekdays";
                if (isWeekends) return "Repeats on weekends";

                return `Repeats on ${days
                  .map((d) => d.slice(0, 3))
                  .join(", ")}`;
              })()}
            </span>
          )}

          <p className="font-semibold text-sm truncate">{task.title}</p>
        </div>

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
          <span>
            {task.due_date ? (
              <div className="flex items-center gap-1">
                📅
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
                {(() => {
                  const today = new Date();
                  const due = new Date(task.due_date);

                  const todayStr = today.toISOString().split("T")[0];
                  const dueStr = due.toISOString().split("T")[0];

                  const msInDay = 1000 * 60 * 60 * 24;
                  const daysDiff = Math.floor(
                    (due.getTime() - today.getTime()) / msInDay
                  );

                  const sameDay = dueStr === todayStr;
                  const isOverdue = dueStr < todayStr;
                  const isTomorrow = daysDiff === 1;
                  const isThisWeek = daysDiff > 1 && daysDiff <= 7;

                  const isThisMonth =
                    due.getMonth() === today.getMonth() &&
                    due.getFullYear() === today.getFullYear();

                  const isNextMonth =
                    due.getMonth() === (today.getMonth() + 1) % 12 &&
                    (due.getFullYear() === today.getFullYear() ||
                      (today.getMonth() === 11 &&
                        due.getFullYear() === today.getFullYear() + 1));

                  if (isOverdue) {
                    return (
                      <span className="ml-2 text-[10px] font-semibold text-red-700 bg-red-200 px-2 py-0.5 rounded-full">
                        Overdue
                      </span>
                    );
                  }

                  if (sameDay) {
                    return (
                      <span className="ml-2 text-[10px] font-semibold text-yellow-700 bg-yellow-200 px-2 py-0.5 rounded-full">
                        Due Today
                      </span>
                    );
                  }

                  if (isTomorrow) {
                    return (
                      <span className="ml-2 text-[10px] font-semibold text-green-700 bg-green-200 px-2 py-0.5 rounded-full">
                        Due Tomorrow
                      </span>
                    );
                  }

                  if (isThisWeek) {
                    return (
                      <span className="ml-2 text-[10px] font-semibold text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full">
                        Due This Week
                      </span>
                    );
                  }

                  if (isThisMonth) {
                    return (
                      <span className="ml-2 text-[10px] font-semibold text-purple-700 bg-purple-200 px-2 py-0.5 rounded-full">
                        Due This Month
                      </span>
                    );
                  }

                  if (isNextMonth) {
                    return (
                      <span className="ml-2 text-[10px] font-semibold text-indigo-700 bg-indigo-200 px-2 py-0.5 rounded-full">
                        Due Next Month
                      </span>
                    );
                  }

                  const isFuture = !isThisMonth && !isNextMonth && due > today;
                  if (isFuture) {
                    return (
                      <span className="ml-2 text-[10px] font-semibold text-gray-700 bg-gray-200 px-2 py-0.5 rounded-full">
                        Future Due
                      </span>
                    );
                  }

                  return null;
                })()}
              </div>
            ) : (
              "No due date"
            )}
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
