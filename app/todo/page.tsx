"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import BoardView from "./components/BoardView";
import AddTaskModal from "./components/AddTaskModal";


import type { Task } from "./types";


const columns = ["Planned", "In Progress", "Done", "On Hold"];

export default function TodoPage() {
  const supabase = createClientComponentClient();
    const [ tasks, setTasks ] = useState<Task[]>( [] );
    const [ showModal, setShowModal ] = useState( false );
    const [ searchQuery, setSearchQuery ] = useState( "" );
    const [statusFilter, setStatusFilter] = useState<
      "" | "planned" | "in_progress" | "done" | "on_hold"
    >("");
    const [dueFilter, setDueFilter] = useState<"" | "overdue" | "today">("");
    const [completionFilter, setCompletionFilter] = useState<
      "" | "complete" | "incomplete"
    >("");

    




  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("todo_tasks")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) setTasks(data as Task[]);
    };

    fetchTasks();
  }, [supabase]);

  const groupedTasks: Record<string, Task[]> = columns.reduce((acc, status) => {
    acc[status] = tasks.filter(
      (t) => t.status.toLowerCase() === status.toLowerCase().replace(" ", "_")
    );
    return acc;
  }, {} as Record<string, Task[]>);

  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "" || task.status === statusFilter;

    const today = new Date().toISOString().split("T")[0];
    const taskDue = task.due_date?.split("T")[0];

    const matchesDue =
      dueFilter === "" ||
      (dueFilter === "overdue" && taskDue && taskDue < today) ||
      (dueFilter === "today" && taskDue === today);

    const matchesCompletion =
      completionFilter === "" ||
      (completionFilter === "complete" && task.completion === 100) ||
      (completionFilter === "incomplete" && task.completion < 100);

    return matchesSearch && matchesStatus && matchesDue && matchesCompletion;
  });
  
  
  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        {/* Left side (View Toggles) */}
        <div className="flex space-x-2">
          {["Board", "To-do", "Table", "List"].map((view) => (
            <button
              key={view}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                view === "Board"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Right side (Filters + Add Task) */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as typeof statusFilter)
            }
            className="px-2 py-1.5 text-sm border border-gray-300 rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="on_hold">On Hold</option>
          </select>

          <select
            value={dueFilter}
            onChange={(e) => setDueFilter(e.target.value as typeof dueFilter)}
            className="px-2 py-1.5 text-sm border border-gray-300 rounded-md"
          >
            <option value="">All Due Dates</option>
            <option value="today">Due Today</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={completionFilter}
            onChange={(e) =>
              setCompletionFilter(e.target.value as typeof completionFilter)
            }
            className="px-2 py-1.5 text-sm border border-gray-300 rounded-md"
          >
            <option value="">All Completion</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("");
              setDueFilter("");
              setCompletionFilter("");
            }}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100"
          >
            Clear Filters
          </button>

          {/* ✅ Moved Add Task button here */}
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 text-sm"
            onClick={() => setShowModal(true)}
          >
            ＋ Add Task
          </button>
        </div>
      </div>

      <BoardView tasks={filteredTasks} setTasks={setTasks} />
      <AddTaskModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onTaskAdded={(newTask) => setTasks((prev) => [...prev, newTask])}
      />
    </div>
  );
}
