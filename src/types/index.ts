import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Tables } from "./database.types";

export type { SupabaseUser };

export type SupabaseActivityLog = Tables<"activity_logs">;

export type BoardMetaRow = Tables<"board_meta">;


export interface User {
  id: string;
  email: string;
  name: string;
  role: "owner" | "admin" | "member" | "viewer";
  avatarUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members: User[];
  encryptionKey?: string;
}

export interface Board {
  id: string;
  workspaceId: string;
  title: string;
  columns: Column[];
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  workspaceId: string;
  boardId: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  deadline?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────
// KANBAN TASK (shape project sekarang)
// ─────────────────────────────────────────────

export interface KanbanTask {
  id: string;
  text: string;
  done: boolean;
  priority?: string;
  deadline?: string;
  createdAt?: number;
  order?: number;
}

export interface KanbanColumns {
  todo: KanbanTask[];
  progress: KanbanTask[];
  done: KanbanTask[];
  [key: string]: KanbanTask[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  target: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface KanbanStats {
  totalTask: number;
  doneTask: number;
  pendingTask: number;
  overdueTask: number;
}

export interface BoardMeta {
  id: string;
  owner_email: string;
  members: string[] | null;
}