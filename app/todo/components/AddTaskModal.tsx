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
  const [ category, setCategory ] = useState( "" );
  const [recurringDays, setRecurringDays] = useState<string[]>([]);
  const toggleDay = (day: string) => {
    setRecurringDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };



  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setStatus(taskToEdit.status || defaultStatus);
      setCompletion(taskToEdit.completion || 0);
      setDueDate(taskToEdit.due_date?.split("T")[0] || "");
      setCategory(taskToEdit.category || "");
      setRecurringDays(taskToEdit.recurring_days || []);
    } else {
      setTitle("");
      setDescription("");
      setStatus(defaultStatus);
      setCompletion(0);
      setDueDate("");
      setCategory("");
      setRecurringDays([]);
    }
  }, [taskToEdit, defaultStatus, open]);
  

  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      status,
      completion,
      due_date: dueDate || null,
      category,
      recurring_days: recurringDays.length ? recurringDays : null,
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

        <label className="text-sm font-medium mt-2 opacity-40">Due Date</label>
        <input
          type="date"
          className="w-full mb-3 p-2 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <label className="text-sm font-medium mt-2 opacity-40">Table</label>
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
        <label className="text-sm font-medium mt-2 opacity-40">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select category</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
        <label className="text-sm font-medium mb-1 block">Repeat on</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <button
              type="button"
              key={day}
              className={`px-3 py-1 rounded-full text-sm border ${
                recurringDays.includes(day.toLowerCase())
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleDay(day.toLowerCase())}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        <label className="text-sm font-medium mt-2 opacity-40">Progress</label>
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
            {taskToEdit ? "Edit Task" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
