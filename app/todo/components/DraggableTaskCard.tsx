"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import type { Task } from "../types";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

export default function DraggableTaskCard({ task, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: "transform 200ms ease",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Pass drag props separately */}
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        dragProps={{ ...attributes, ...listeners }} // 👈 pass drag props here
      />
    </div>
  );
}
  
