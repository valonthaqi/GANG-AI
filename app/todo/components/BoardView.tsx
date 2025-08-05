"use client";

import DraggableTaskCard from "./DraggableTaskCard";
import type { Task } from "../types";
import AddTaskModal from "./AddTaskModal";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";



const columns = ["Planned", "In Progress", "Done", "On Hold"];

type BoardViewProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};
  

export default function BoardView({ tasks, setTasks }: BoardViewProps) {
  const [showModal, setShowModal] = useState(false);
  const supabase = createClientComponentClient();
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [modalStatus, setModalStatus] = useState<
    "planned" | "in_progress" | "done" | "on_hold"
  >("planned");

  const groupedTasks: Record<string, Task[]> = columns.reduce((acc, status) => {
    acc[status] = tasks.filter(
      (t) => t.status.toLowerCase() === status.toLowerCase().replace(" ", "_")
    );
    return acc;
  }, {} as Record<string, Task[]>);
  function DroppableColumn({
    columnId,
    children,
  }: {
    columnId: string;
    children: React.ReactNode;
  }) {
    const { setNodeRef } = useDroppable({
      id: columnId,
    });

    return (
      <div
        ref={setNodeRef}
        className="bg-gray-200 rounded-lg p-4 min-h-[400px] flex flex-col"
      >
        {children}
      </div>
    );
  }
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active) return;
    if (active.id === over.id) return;

    const taskId = active.id.toString();
    const newStatus = over.id.toString().toLowerCase().replace(" ", "_");

    // Update status in Supabase
    await supabase
      .from("todo_tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    // Update local state instantly
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus as Task["status"] } : t
      )
    );
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => (
          <DroppableColumn key={col} columnId={col}>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">{col}</h2>
              <button
                className="text-gray-400 hover:text-black text-xl leading-none"
                onClick={() => {
                  const internalStatus = col.toLowerCase().replace(" ", "_") as
                    | "planned"
                    | "in_progress"
                    | "done"
                    | "on_hold";
                  setModalStatus(internalStatus);
                  setShowModal(true);
                }}
              >
                ＋
              </button>
            </div>

            {groupedTasks[col]?.map((task) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                onEdit={(task) => {
                  setModalStatus(task.status);
                  setTaskToEdit(task);
                  setShowModal(true);
                }}
                onDelete={async (id) => {
                  await supabase.from("todo_tasks").delete().eq("id", id);

                  setTasks((prev) => prev.filter((t) => t.id !== id));
                }}
              />
            ))}
            <AddTaskModal
              open={showModal}
              onClose={() => {
                setShowModal(false);
                setTaskToEdit(null);
              }}
              defaultStatus={modalStatus}
              taskToEdit={taskToEdit}
              onTaskAdded={(newTask) =>
                setTasks((prev) =>
                  prev.some((t) => t.id === newTask.id)
                    ? prev.map((t) => (t.id === newTask.id ? newTask : t))
                    : [...prev, newTask]
                )
              }
            />
          </DroppableColumn>
        ))}
      </div>
    </DndContext>
  );
}
