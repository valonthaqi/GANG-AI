"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Task } from "../types";



type Props = {
  open: boolean;
  onClose: () => void;
  onTaskAdded: (newTask: Task) => void;
  defaultStatus?: "planned" | "in_progress" | "done" | "on_hold";
  taskToEdit?: Task | null;
};
  

export default function AddTaskModal({
  open,
  onClose,
  onTaskAdded,
  defaultStatus = "planned",
  taskToEdit = null,
}: Props) {
  const supabase = createClientComponentClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(defaultStatus);
  const [completion, setCompletion] = useState(0);
  const [dueDate, setDueDate] = useState("");
  

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setStatus(taskToEdit.status || defaultStatus);
      setCompletion(taskToEdit.completion || 0);
      setDueDate(taskToEdit.due_date?.split("T")[0] || "");
    } else {
      setTitle("");
      setDescription("");
      setStatus(defaultStatus);
      setCompletion(0);
      setDueDate("");
    }
  }, [taskToEdit, defaultStatus, open]);
  

  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      status,
      completion,
      due_date: dueDate || null,
    };

    let result;
    if (taskToEdit) {
      // 📝 Edit existing task
      result = await supabase
        .from("todo_tasks")
        .update(payload)
        .eq("id", taskToEdit.id)
        .select()
        .single();
    } else {
      // ➕ Create new task
      result = await supabase
        .from("todo_tasks")
        .insert([payload])
        .select()
        .single();
    }

    const { data, error } = result;

    if (!error && data) {
      onTaskAdded(data as Task);
      onClose();
      // reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setCompletion(0);
      setStatus("planned");
    }
  };
  

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {taskToEdit ? "Edit Task" : "Add New Task"}
          </h2>

          {taskToEdit && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              Editing
            </span>
          )}
        </div>

        <input
          type="text"
          placeholder="Title"
          className="w-full mb-3 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full mb-3 p-2 border rounded"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          className="w-full mb-3 p-2 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as "planned" | "in_progress" | "done" | "on_hold"
            )
          }
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
          <option value="on_hold">On Hold</option>
        </select>

        <input
          type="number"
          min={0}
          max={100}
          value={completion}
          onChange={(e) => setCompletion(Number(e.target.value))}
          className="w-full mb-3 p-2 border rounded"
          placeholder="Completion %"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm bg-black text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
