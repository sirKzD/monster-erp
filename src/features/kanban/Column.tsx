import { useDroppable } from "@dnd-kit/core";
import { 
    SortableContext, 
    verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import TodoItem from "./TodoItem";
import type { KanbanTask } from "../../types";

interface ColumnProps {
    id: string
    items: KanbanTask[];
    toggleTodo: (colId: string, id: string) => void;
    deleteTodo: (colId: string, id: string) => void;
    editTodo: (colId: string, id: string, text: string) => void;
    deleteColumn: (colId: string) => void;
    renameColumn: (colId: string, newId: string) => void;
}

function Column({ 
    id, 
    items, 
    toggleTodo, 
    deleteTodo, 
    editTodo, 
    deleteColumn, 
    renameColumn 
}: ColumnProps) {

    const { setNodeRef, isOver } = useDroppable({ id });

    const handleRename = (): void => {
        const newName = prompt("Rename kolom:", id);
        if (!newName) return;
        const newId = newName.toLowerCase().replace(/\s+/g, "_");
        renameColumn(id, newId);
    };

    return (
        <div className="column">
            <h3 onDoubleClick={handleRename}>
                {id.toUpperCase()}
            </h3>

            <button onClick={() => deleteColumn(id)}>🗑</button>

            <div
              ref={setNodeRef}
              className={`column-drop ${isOver ? "active" : ""}`}
            >
                <SortableContext
                  items={items.map(i => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                    {items.map(item => (
                        <TodoItem 
                            key={item.id} 
                            id={item.id} 
                            todo={item} 
                            colId={id}
                            toggleTodo={toggleTodo}
                            deleteTodo={deleteTodo}
                            editTodo={editTodo}
                        />
                    ))}
                </SortableContext>

                {items.length === 0 && (
                    <p style={{ opacity: 0.5 }}>Drop here...</p>
                )}
            </div>
        </div>
    );
}

export default Column;