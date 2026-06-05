import type { KanbanTask, KanbanColumns } from "../types";
import type { SupabaseUser } from "../types";


type SetColumns = React.Dispatch<React.SetStateAction<KanbanColumns>>;


interface AddTodoParams {
  input: string;
  priority: string;
  deadline: string;
  columns: KanbanColumns;
  setColumns: SetColumns;
  addLog: (action: string, user: SupabaseUser | null) => Promise<void>;
  user: SupabaseUser | null;
  onSuccess: () => void; 
}

export function addTodo({
  input,
  priority,
  deadline,
  columns,
  setColumns,
  addLog,
  user,
  onSuccess
}: AddTodoParams): void {

  if (!input.trim()) return;

  const newTodo: KanbanTask = {
    id: Date.now().toString(),
    text: input,
    done: false,
    priority,
    deadline: deadline || undefined,
    createdAt: Date.now()
  };

  setColumns(prev => ({
    ...prev,
    todo: [...prev.todo, newTodo]
  }));

  addLog(`added task "${input}"`, user);
  onSuccess();
}

export function toggleTodo(
  colId: string,
  id: string,
  setColumns: SetColumns
): void {
  setColumns(prev => ({
    ...prev,
    [colId]: prev[colId].map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    )
  }));
}

export function deleteTodo(
  colId: string,
  id: string,
  columns: KanbanColumns,
  setColumns: SetColumns,
  addLog: (action: string, user: SupabaseUser | null) => Promise<void>,
  user: SupabaseUser | null
): void {
  const taskText = columns[colId].find(t => t.id === id)?.text ?? "";

  setColumns(prev => ({
    ...prev,
    [colId]: prev[colId].filter(todo => todo.id !== id)
  }));

  addLog(`deleted task "${taskText}"`, user);
}

export function editTodo(
  colId: string,
  id: string,
  newText: string,
  setColumns: SetColumns,
  addLog: (action: string, user: SupabaseUser | null) => Promise<void>,
  user: SupabaseUser | null
): void {
  setColumns(prev => ({
    ...prev,
    [colId]: prev[colId].map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    )
  }));

  addLog(`edited task "${newText}"`, user);
}

export function addColumn(
  setColumns: SetColumns,
  addLog: (action: string, user: SupabaseUser | null) => Promise<void>,
  user: SupabaseUser | null
): void {
  const name = prompt("Nama kolom?");
  if (!name) return;

  const id = name.toLowerCase().replace(/\s+/g, "_");

  setColumns(prev => ({ ...prev, [id]: [] }));
  addLog(`created column "${id}"`, user);
}

export function deleteColumn(
  colId: string,
  columns: KanbanColumns,
  setColumns: SetColumns,
  addLog: (action: string, user: SupabaseUser | null) => Promise<void>,
  user: SupabaseUser | null
): void {
  const copy = { ...columns };
  delete copy[colId];
  setColumns(copy);
  addLog(`deleted column "${colId}"`, user);
}

export function renameColumn(
  oldId: string,
  newId: string,
  columns: KanbanColumns,
  setColumns: SetColumns,
  addLog: (action: string, user: SupabaseUser | null) => Promise<void>,
  user: SupabaseUser | null
): void {
  if (columns[newId]) return;

  const copy = { ...columns };
  copy[newId] = copy[oldId];
  delete copy[oldId];

  setColumns(copy);
  addLog(`renamed column "${oldId}" to "${newId}"`, user);
}

export function generateAITasks(
  prompt: string,
  columns: KanbanColumns,
  setColumns: SetColumns,
  addLog: (action: string, user: SupabaseUser | null) => Promise<void>,
  user: SupabaseUser | null
): void {

  const fakeAI = [
    `📘 Research: ${prompt}`,
    `🛠 Build: ${prompt}`,
    `🔥 Practice daily`,
    `📚 Watch tutorial`,
    `✅ Mini project`,
    `🚀 Deploy result`
  ];

  const aiTodos: KanbanTask[] = fakeAI.map((text, index) => ({
    id: `${Date.now()}-${index}`,
    text,
    done: false,
    priority: "medium",
    deadline: undefined,
    createdAt: Date.now(),
    order: columns.todo.length + index
  }));

  setColumns(prev => ({
    ...prev,
    todo: [...prev.todo, ...aiTodos]
  }));

  addLog(`AI generated tasks for "${prompt}"`, user);
}