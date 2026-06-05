import { supabase } from "../utils/supabase";
import type { Tables, TablesInsert } from "../types/database.types";

export type ActivityLogRow    = Tables<"activity_logs">;
export type ActivityLogInsert = TablesInsert<"activity_logs">;

export const activityRepository = {

    async findByBoard(
        boardId: string,
        limit = 30
    ): Promise<ActivityLogRow[]> {

        const { data, error } = await supabase
          .from("activity_logs")
          .select("*")
          .eq("board_id", boardId)
          .order("created_at", { ascending: false })

        if (error) {
            console.error("[activityRepository.findByBoard]", error);
            return [];
        }

        return data ?? [];
    },

    async insert(
        payload: ActivityLogInsert
    ): Promise<ActivityLogRow | null> {

        const { data, error } = await supabase
          .from("activity_logs")
          .insert(payload)
          .select()
          .single();

        if (error) {
            console.error("[activityRepository.insert]", error);
            return null;
        }

        return data;
    }
};