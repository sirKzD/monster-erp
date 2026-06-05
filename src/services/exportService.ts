import type { KanbanColumns } from "../types";

export function exportData(
  columns: KanbanColumns,
  activeBoard: string
): void {
  const blob = new Blob(
    [JSON.stringify(columns, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kanban-${activeBoard}.json`;
  a.click();
  URL.revokeObjectURL(url);
}