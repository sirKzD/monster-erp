import { supabase } from "../../../utils/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type {
  Tables,
  TablesInsert,
  TablesUpdate
} from "../../../types/database.types";

export type KanbanBoardRow    = Tables<"sirKzDPorto">;
export type KanbanBoardInsert = TablesInsert<"sirKzDPorto">;
export type KanbanBoardUpdate = TablesUpdate<"sirKzDPorto">;

export const kanbanRepository = {

  async findById(boardId: string): Promise<KanbanBoardRow | null> {
    const { data, error } = await supabase
      .from("sirKzDPorto")
      .select("*")
      .eq("id", boardId)
      .maybeSingle();
    if (error) { console.error("[kanbanRepository.findById]", error); return null; }
    return data;
  },

  async insert(payload: KanbanBoardInsert): Promise<KanbanBoardRow | null> {
    const { data, error } = await supabase
      .from("sirKzDPorto")
      .insert(payload)
      .select()
      .single();
    if (error) { console.error("[kanbanRepository.insert]", error); return null; }
    return data;
  },

  async update(boardId: string, payload: KanbanBoardUpdate): Promise<KanbanBoardRow | null> {
    const { data, error } = await supabase
      .from("sirKzDPorto")
      .update(payload)
      .eq("id", boardId)
      .select()
      .single();
    if (error) { console.error("[kanbanRepository.update]", error); return null; }
    return data;
  },

  subscribeToUpdates(
    boardId: string,
    callback: (row: KanbanBoardRow) => void
  ): RealtimeChannel {
    return supabase
      .channel(`kanban-${boardId}`)
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "sirKzDPorto" },
        (payload) => { callback(payload.new as KanbanBoardRow); }
      )
      .subscribe();
  },

  removeChannel(channel: RealtimeChannel): void {
    supabase.removeChannel(channel);
  }
};