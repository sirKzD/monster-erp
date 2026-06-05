import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { KanbanTask } from "../../types";


interface TodoItemProps {
  id: string;
  todo: KanbanTask;
  colId: string;
  toggleTodo: (colId: string, id: string) => void;
  deleteTodo: (colId: string, id: string) => void;
  editTodo: (colId: string, id: string, text: string) => void;
}


function TodoItem({
  id,
  todo,
  colId,
  toggleTodo,
  deleteTodo,
  editTodo
}: TodoItemProps) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1
  };

  const [isEditing, setIsEditing] =
    useState<boolean>(false);

  const [editText, setEditText] =
    useState<string>(todo.text);

  const handleEdit = (): void => {
    if (editText.trim() === "") return;
    editTodo(colId, id, editText);
    setIsEditing(false);
  };

  const isOverdue: boolean =
    !!todo.deadline &&
    !todo.done &&
    new Date(todo.deadline) < new Date();

  return (
    <li ref={setNodeRef} style={style} {...attributes}>

      <span {...listeners} style={{ cursor: "grab" }}>
        ⠿
      </span>

      {isEditing ? (
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => e.key === "Enter" && handleEdit()}
          autoFocus
        />
      ) : (
        <span
          onClick={() => toggleTodo(colId, id)}
          onDoubleClick={() => setIsEditing(true)}
          style={{
            textDecoration: todo.done ? "line-through" : "none",
            opacity: todo.done ? 0.5 : 1
          }}
        >
          {todo.text}
        </span>
      )}

      <div>
        {todo.priority === "high" && "🔴 High"}
        {todo.priority === "medium" && "🟡 Medium"}
        {todo.priority === "low" && "🟢 Low"}
      </div>

      {todo.deadline && (
        <div style={{ color: isOverdue ? "red" : "inherit" }}>
          📅 {todo.deadline} {isOverdue && "⚠️ Overdue!"}
        </div>
      )}

      <button onClick={() => deleteTodo(colId, id)}>❌</button>

    </li>
  );
}

export default TodoItem;