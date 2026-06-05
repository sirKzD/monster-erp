import { useState } from "react";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent
} from "@dnd-kit/core";
import Column from "./Column";
import TodoItem from "./TodoItem";
import type { KanbanTask, KanbanColumns } from "../../types";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type FilterType = "all" | "done" | "pending";

interface BoardProps {
  columns: KanbanColumns;
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumns>>;
  toggleTodo: (colId: string, id: string) => void;
  deleteTodo: (colId: string, id: string) => void;
  editTodo: (colId: string, id: string, text: string) => void;
  deleteColumn: (colId: string) => void;
  renameColumn: (oldId: string, newId: string) => void;
  search: string;
  filter: FilterType;
  setDragging: (value: boolean) => void;
}

const priorityRank: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1
};

function Board({
  columns,
  setColumns,
  toggleTodo,
  deleteTodo,
  editTodo,
  deleteColumn,
  renameColumn,
  search,
  filter,
  setDragging
}: BoardProps) {

  const [activeItem, setActiveItem] =
    useState<KanbanTask | null>(null);

  const findColumn = (id: string): string | undefined => {
    return Object.keys(columns).find(col =>
      columns[col].some(item => item.id === id)
    );
  };

  const isColumn = (id: string): boolean =>
    Object.keys(columns).includes(id);

  const updateOrder = (items: KanbanTask[]): KanbanTask[] =>
    items.map((item, index) => ({ ...item, order: index }));

  const handleDragStart = (event: DragStartEvent): void => {
    const { active } = event;
    setDragging(true);

    const col = findColumn(String(active.id));
    if (!col) return;

    const item = columns[col].find(i => i.id === active.id);
    if (!item) return;

    setActiveItem(item);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    setActiveItem(null);
    setDragging(false);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceCol = findColumn(activeId);
    if (!sourceCol) return;

    const targetCol = isColumn(overId)
      ? overId
      : findColumn(overId);

    if (!targetCol) return;

    // Drag dalam kolom yang sama
    if (sourceCol === targetCol) {
      const items = [...columns[sourceCol]];

      const oldIndex = items.findIndex(i => i.id === activeId);
      const newIndex = items.findIndex(i => i.id === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      const [moved] = items.splice(oldIndex, 1);
      items.splice(newIndex, 0, moved);

      setColumns({
        ...columns,
        [sourceCol]: updateOrder(items)
      });

    // Drag pindah kolom
    } else {
      const sourceItems = [...columns[sourceCol]];
      const targetItems = [...columns[targetCol]];

      const oldIndex = sourceItems.findIndex(i => i.id === activeId);
      if (oldIndex === -1) return;

      const [moved] = sourceItems.splice(oldIndex, 1);

      const updatedMoved: KanbanTask = {
        ...moved,
        done: targetCol === "done"
      };

      const overIndex = targetItems.findIndex(i => i.id === overId);

      if (overIndex === -1) {
        targetItems.push(updatedMoved);
      } else {
        targetItems.splice(overIndex, 0, updatedMoved);
      }

      setColumns({
        ...columns,
        [sourceCol]: updateOrder(sourceItems),
        [targetCol]: updateOrder(targetItems)
      });
    }
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {Object.keys(columns).map(col => {

          const filteredItems = [...columns[col]]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .sort((a, b) =>
              (priorityRank[b.priority ?? ""] ?? 0) -
              (priorityRank[a.priority ?? ""] ?? 0)
            )
            .filter(todo =>
              todo.text.toLowerCase().includes(search.toLowerCase())
            )
            .filter(todo => {
              if (filter === "done") return todo.done;
              if (filter === "pending") return !todo.done;
              return true;
            });

          return (
            <Column
              key={col}
              id={col}
              items={filteredItems}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
              deleteColumn={deleteColumn}
              renameColumn={renameColumn}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="drag-overlay">
            <TodoItem
              id={activeItem.id}
              todo={activeItem}
              colId={findColumn(activeItem.id) ?? ""}
              toggleTodo={() => {}}
              deleteTodo={() => {}}
              editTodo={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Board;