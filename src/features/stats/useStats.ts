import type { KanbanColumns, KanbanTask, KanbanStats } from "../../types";

export default function useStats(
  columns: KanbanColumns
): KanbanStats {

  const allTasks: KanbanTask[] =
    Object.values(columns).flat();

  const totalTask = allTasks.length;

  const doneTask = allTasks.filter(
    t => t.done
  ).length;

  const pendingTask = totalTask - doneTask;

  const overdueTask = allTasks.filter(task => {
    if (!task.deadline) return false;
    if (task.done) return false;
    return new Date(task.deadline) < new Date();
  }).length;

  return {
    totalTask,
    doneTask,
    pendingTask,
    overdueTask
  };
}